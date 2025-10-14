from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from authentication.utils import send_otp_utility, verify_otp_utility
from authentication.models import OTP

User = get_user_model()


class Command(BaseCommand):
    help = "Test authentication system by creating test user and OTP"

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            type=str,
            help="Email for test user",
            default="test@example.com",
        )
        parser.add_argument(
            "--phone",
            type=str,
            help="Phone for test user",
            default="+1234567890",
        )

    def handle(self, *args, **options):
        email = options["email"]
        phone = options["phone"]

        try:
            # Create test user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": "Test",
                    "last_name": "User",
                    "user_type": "customer",
                    "phone": phone,
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

            # Test OTP sending
            self.stdout.write(self.style.WARNING("Testing OTP sending..."))
            otp_result = send_otp_utility(user, "signup", user.email)

            if otp_result["success"]:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"OTP sent successfully to {otp_result.get('masked_email')}"
                    )
                )
                self.stdout.write(
                    f"Validity: {otp_result.get('validity_minutes')} minutes"
                )

                # Get the OTP from database for testing
                otp = OTP.objects.filter(
                    user=user, otp_type="signup", is_used=False
                ).first()

                if otp:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Test OTP Code: {otp.otp_code} (for testing only)"
                        )
                    )

                    # Test OTP verification
                    self.stdout.write(self.style.WARNING("Testing OTP verification..."))
                    verify_result = verify_otp_utility(
                        user, otp.otp_code, "signup", user.email
                    )

                    if verify_result["success"]:
                        self.stdout.write(
                            self.style.SUCCESS("OTP verification successful!")
                        )
                    else:
                        self.stdout.write(
                            self.style.ERROR(
                                f"OTP verification failed: {verify_result.get('message')}"
                            )
                        )
                else:
                    self.stdout.write(
                        self.style.ERROR("Could not find OTP in database")
                    )
            else:
                self.stdout.write(
                    self.style.ERROR(f"Failed to send OTP: {otp_result.get('message')}")
                )

            # Show OTP statistics
            otp_count = OTP.objects.filter(user=user).count()
            self.stdout.write(self.style.SUCCESS(f"Total OTPs for user: {otp_count}"))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error testing authentication: {str(e)}")
            )
