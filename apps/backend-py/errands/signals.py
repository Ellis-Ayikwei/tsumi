from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import Errand, ErrandRating
from notifications.services import NotificationService


@receiver(post_save, sender=Errand)
def handle_errand_status_change(sender, instance, created, **kwargs):
    """Handle errand status changes and send notifications"""

    if created:
        # New errand created - notify customer
        NotificationService.notify_errand_created(instance.customer, instance)

    else:
        # Status change - check what changed
        if instance.status == "assigned" and instance.agent:
            # Errand assigned to agent - notify both customer and agent
            NotificationService.notify_errand_assigned(instance.customer, instance)
            NotificationService.notify_errand_assigned(instance.agent, instance)

        elif instance.status == "in_progress":
            # Errand started - notify customer
            NotificationService.create_notification(
                user=instance.customer,
                notification_type="errand_started",
                title="Errand Started",
                message=f"Your errand '{instance.title}' has been started by {instance.agent.full_name if instance.agent else 'your agent'}.",
                data={"errand_id": str(instance.id), "errand_title": instance.title},
                action_url=f"/errands/{instance.id}",
                action_text="View Errand",
            )

        elif instance.status == "completed":
            # Errand completed - notify customer and agent
            NotificationService.notify_errand_completed(instance.customer, instance)
            NotificationService.create_notification(
                user=instance.agent,
                notification_type="errand_completed",
                title="Errand Completed",
                message=f"You have successfully completed the errand '{instance.title}'.",
                data={"errand_id": str(instance.id), "errand_title": instance.title},
                action_url=f"/agent/errands/{instance.id}",
                action_text="View Errand",
            )

        elif instance.status == "cancelled":
            # Errand cancelled - notify relevant parties
            if instance.agent:
                NotificationService.create_notification(
                    user=instance.agent,
                    notification_type="errand_cancelled",
                    title="Errand Cancelled",
                    message=f"The errand '{instance.title}' has been cancelled.",
                    data={
                        "errand_id": str(instance.id),
                        "errand_title": instance.title,
                    },
                    priority="high",
                )

            NotificationService.create_notification(
                user=instance.customer,
                notification_type="errand_cancelled",
                title="Errand Cancelled",
                message=f"Your errand '{instance.title}' has been cancelled.",
                data={"errand_id": str(instance.id), "errand_title": instance.title},
                action_url=f"/errands/{instance.id}",
                action_text="View Errand",
                priority="high",
            )


@receiver(post_save, sender=ErrandRating)
def handle_errand_rating(sender, instance, created, **kwargs):
    """Handle errand rating and send notifications"""

    if created:
        # New rating received - notify the rated user
        NotificationService.notify_rating_received(instance.rated_user, instance)

        # Update user's average rating
        from django.db.models import Avg
        from django.contrib.auth import get_user_model

        User = get_user_model()
        user = instance.rated_user

        # Calculate new average rating
        avg_rating = user.received_ratings.aggregate(avg_rating=Avg("rating"))[
            "avg_rating"
        ]
        if avg_rating:
            user.average_rating = round(avg_rating, 2)
            user.save()

            # Send notification about rating update
            NotificationService.create_notification(
                user=user,
                notification_type="trust_score_updated",
                title="Rating Updated",
                message=f"Your average rating has been updated to {user.average_rating} stars.",
                data={
                    "new_rating": user.average_rating,
                    "total_ratings": user.received_ratings.count(),
                },
                action_url="/profile",
                action_text="View Profile",
            )
