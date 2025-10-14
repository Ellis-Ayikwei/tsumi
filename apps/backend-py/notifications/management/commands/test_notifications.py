from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from notifications.services import NotificationService

User = get_user_model()


class Command(BaseCommand):
    help = "Test notification system by creating sample notifications"

    def add_arguments(self, parser):
        parser.add_argument(
            "--user-email",
            type=str,
            help="Email of user to send test notifications to",
            default="test@example.com",
        )
        parser.add_argument(
            "--count",
            type=int,
            help="Number of test notifications to create",
            default=5,
        )

    def handle(self, *args, **options):
        user_email = options["user_email"]
        count = options["count"]

        try:
            # Get or create test user
            user, created = User.objects.get_or_create(
                email=user_email,
                defaults={
                    "first_name": "Test",
                    "last_name": "User",
                    "user_type": "customer",
                },
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created test user: {user.email}")
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f"Using existing user: {user.email}")
                )

            # Create test notifications
            for i in range(count):
                notification = NotificationService.create_notification(
                    user=user,
                    notification_type="system",
                    title=f"Test Notification {i + 1}",
                    message=f"This is test notification number {i + 1} for testing the notification system.",
                    priority="normal",
                    data={"test_id": i + 1, "timestamp": "2024-01-01T00:00:00Z"},
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created notification: {notification.title} (ID: {notification.id})"
                    )
                )

            # Test convenience methods
            self.stdout.write(self.style.WARNING("Testing convenience methods..."))

            # Test errand notification (with mock data)
            class MockErrand:
                id = "test-errand-123"
                title = "Test Errand"

            mock_errand = MockErrand()
            NotificationService.notify_errand_created(user, mock_errand)
            self.stdout.write(
                self.style.SUCCESS(
                    "Created errand notification using convenience method"
                )
            )

            # Get notification summary
            unread_count = NotificationService.get_unread_count(user)
            self.stdout.write(
                self.style.SUCCESS(f"User has {unread_count} unread notifications")
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully created {count + 1} test notifications for {user.email}"
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error creating test notifications: {str(e)}")
            )
