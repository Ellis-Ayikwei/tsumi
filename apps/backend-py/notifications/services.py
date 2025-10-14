from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import Notification, NotificationPreference

User = get_user_model()


class NotificationService:
    """Centralized notification service for Tsumi platform"""

    @staticmethod
    def create_notification(
        user,
        notification_type,
        title=None,
        message=None,
        data=None,
        priority="normal",
        channels=None,
        action_url=None,
        action_text=None,
        expires_at=None,
        related_object_type=None,
        related_object_id=None,
    ):
        """Create a new notification"""

        # Get user preferences
        preferences, created = NotificationPreference.objects.get_or_create(
            user=user,
            defaults={
                "email_notifications": True,
                "push_notifications": True,
                "in_app_notifications": True,
            },
        )

        # Set default channels if not provided
        if channels is None:
            channels = ["in_app"]
            if preferences.email_notifications:
                channels.append("email")
            if preferences.push_notifications:
                channels.append("push")

        # Generate title and message if not provided
        if not title:
            title = NotificationService._generate_title(notification_type, data)
        if not message:
            message = NotificationService._generate_message(notification_type, data)

        # Create notification
        notification = Notification.objects.create(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            data=data or {},
            priority=priority,
            delivery_channels=channels,
            action_url=action_url,
            action_text=action_text,
            expires_at=expires_at,
            related_object_type=related_object_type,
            related_object_id=related_object_id,
        )

        # Send through configured channels
        NotificationService._send_notification(notification, preferences)

        return notification

    @staticmethod
    def _generate_title(notification_type, data):
        """Generate notification title based on type"""
        title_map = {
            "errand_created": "New Errand Created",
            "errand_assigned": "Errand Assigned to You",
            "errand_accepted": "Errand Accepted",
            "errand_started": "Errand Started",
            "errand_completed": "Errand Completed",
            "errand_cancelled": "Errand Cancelled",
            "payment_confirmed": "Payment Confirmed",
            "payment_failed": "Payment Failed",
            "agent_verified": "Agent Account Verified",
            "rating_received": "New Rating Received",
            "message_received": "New Message",
        }
        return title_map.get(notification_type, "New Notification")

    @staticmethod
    def _generate_message(notification_type, data):
        """Generate notification message based on type"""
        message_map = {
            "errand_created": "A new errand has been created and is waiting for assignment.",
            "errand_assigned": "You have been assigned a new errand.",
            "errand_accepted": "Your errand has been accepted by an agent.",
            "errand_started": "Your errand is now in progress.",
            "errand_completed": "Your errand has been completed successfully.",
            "errand_cancelled": "Your errand has been cancelled.",
            "payment_confirmed": "Your payment has been processed successfully.",
            "payment_failed": "Your payment could not be processed.",
            "agent_verified": "Congratulations! Your agent account has been verified.",
            "rating_received": "You have received a new rating for your service.",
            "message_received": "You have received a new message.",
        }
        return message_map.get(notification_type, "You have a new notification.")

    @staticmethod
    def _send_notification(notification, preferences):
        """Send notification through configured channels"""

        # Always mark in-app as delivered
        notification.mark_as_delivered("in_app")

        # Send email if enabled
        if (
            "email" in notification.delivery_channels
            and preferences.email_notifications
        ):
            NotificationService._send_email_notification(notification)

        # Send push notification if enabled
        if "push" in notification.delivery_channels and preferences.push_notifications:
            NotificationService._send_push_notification(notification)

        # Send SMS if enabled
        if "sms" in notification.delivery_channels and preferences.sms_notifications:
            NotificationService._send_sms_notification(notification)

    @staticmethod
    def _send_email_notification(notification):
        """Send email notification"""
        try:
            send_mail(
                subject=f"Tsumi: {notification.title}",
                message=notification.message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[notification.user.email],
                fail_silently=False,
            )
            notification.mark_as_delivered("email")
        except Exception as e:
            # Log error but don't fail the notification creation
            import logging

            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send email notification: {str(e)}")

    @staticmethod
    def _send_push_notification(notification):
        """Send push notification (placeholder for future implementation)"""
        # TODO: Implement push notification service (Firebase, etc.)
        notification.mark_as_delivered("push")

    @staticmethod
    def _send_sms_notification(notification):
        """Send SMS notification (placeholder for future implementation)"""
        # TODO: Implement SMS service (Twilio, etc.)
        notification.mark_as_delivered("sms")

    # Convenience methods for common notification types

    @staticmethod
    def notify_errand_created(user, errand_obj):
        """Notify when an errand is created"""
        return NotificationService.create_notification(
            user=user,
            notification_type="errand_created",
            data={
                "errand_id": str(errand_obj.id),
                "errand_title": getattr(errand_obj, "title", "Errand"),
            },
            action_url=f"/errands/{errand_obj.id}",
            action_text="View Errand",
        )

    @staticmethod
    def notify_errand_assigned(user, errand_obj):
        """Notify when an errand is assigned to an agent"""
        return NotificationService.create_notification(
            user=user,
            notification_type="errand_assigned",
            data={
                "errand_id": str(errand_obj.id),
                "errand_title": getattr(errand_obj, "title", "Errand"),
            },
            action_url=f"/agent/errands/{errand_obj.id}",
            action_text="View Errand",
        )

    @staticmethod
    def notify_errand_completed(user, errand_obj):
        """Notify when an errand is completed"""
        return NotificationService.create_notification(
            user=user,
            notification_type="errand_completed",
            data={
                "errand_id": str(errand_obj.id),
                "errand_title": getattr(errand_obj, "title", "Errand"),
            },
            action_url=f"/errands/{errand_obj.id}",
            action_text="View Errand",
        )

    @staticmethod
    def notify_payment_confirmed(user, payment_obj):
        """Notify when payment is confirmed"""
        return NotificationService.create_notification(
            user=user,
            notification_type="payment_confirmed",
            data={
                "payment_id": str(payment_obj.id),
                "amount": getattr(payment_obj, "amount", 0),
            },
            action_url="/wallet",
            action_text="View Wallet",
        )

    @staticmethod
    def notify_agent_verified(user, agent_obj):
        """Notify when agent account is verified"""
        return NotificationService.create_notification(
            user=user,
            notification_type="agent_verified",
            priority="high",
            action_url="/agent/dashboard",
            action_text="Go to Dashboard",
        )

    @staticmethod
    def notify_rating_received(user, rating_obj):
        """Notify when a rating is received"""
        return NotificationService.create_notification(
            user=user,
            notification_type="rating_received",
            data={
                "rating": getattr(rating_obj, "rating", 0),
                "review": getattr(rating_obj, "review", ""),
            },
            action_url="/profile",
            action_text="View Profile",
        )

    @staticmethod
    def notify_message_received(user, message_obj):
        """Notify when a message is received"""
        return NotificationService.create_notification(
            user=user,
            notification_type="message_received",
            data={
                "message_id": str(message_obj.id),
                "sender": getattr(message_obj, "sender", ""),
            },
            action_url="/messages",
            action_text="View Messages",
        )

    @staticmethod
    def get_user_notifications(user, unread_only=False, limit=20):
        """Get notifications for a user"""
        queryset = Notification.objects.filter(user=user)

        if unread_only:
            queryset = queryset.filter(read=False)

        return queryset.order_by("-created_at")[:limit]

    @staticmethod
    def mark_all_as_read(user):
        """Mark all notifications as read for a user"""
        return Notification.objects.filter(user=user, read=False).update(
            read=True, read_at=timezone.now()
        )

    @staticmethod
    def get_unread_count(user):
        """Get unread notification count for a user"""
        return Notification.objects.filter(user=user, read=False).count()

    @staticmethod
    def cleanup_old_notifications(days_old=30):
        """Clean up old read notifications"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days_old)
        deleted_count, _ = Notification.objects.filter(
            read=True, created_at__lt=cutoff_date
        ).delete()
        return deleted_count
