from django.core.management.base import BaseCommand
from django.db import transaction
from apps.Request.models import Request
from apps.Request.utils.calculate_estimated_distance_hybrid import (
    calculate_distance_hybrid,
    clear_distance_cache,
)
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Recalculate estimated distances for all requests"

    def add_arguments(self, parser):
        parser.add_argument(
            "--request-id",
            type=str,
            help="Recalculate distance for a specific request ID only",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force recalculation even if distance already exists",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be updated without making changes",
        )

    def handle(self, *args, **options):
        request_id = options.get("request_id")
        force = options.get("force", False)
        dry_run = options.get("dry_run", False)

        if dry_run:
            self.stdout.write(
                self.style.WARNING("DRY RUN MODE - No changes will be made")
            )

        if request_id:
            self.recalculate_single_request(request_id, force, dry_run)
        else:
            self.recalculate_all_requests(force, dry_run)

    def recalculate_single_request(self, request_id, force, dry_run):
        """Recalculate distance for a single request."""
        try:
            request = Request.objects.get(id=request_id)
            self.stdout.write(f"Processing request {request_id}...")

            if not force and request.estimated_distance is not None:
                self.stdout.write(
                    self.style.WARNING(
                        f"Request {request_id} already has distance. Use --force to recalculate."
                    )
                )
                return

            if not request.stops.exists():
                self.stdout.write(
                    self.style.WARNING(f"Request {request_id} has no stops")
                )
                return

            # Check valid coordinates
            valid_stops = request.stops.filter(
                location__latitude__isnull=False, location__longitude__isnull=False
            ).count()

            if valid_stops < 2:
                self.stdout.write(
                    self.style.WARNING(
                        f"Request {request_id} has insufficient valid coordinates"
                    )
                )
                return

            if not dry_run:
                # Clear cache and calculate
                clear_distance_cache(request)
                distance = calculate_distance_hybrid(request, prefer_api=True)

                if distance is not None:
                    with transaction.atomic():
                        request.estimated_distance = distance
                        request.save(update_fields=["estimated_distance"])

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Updated distance for request {request_id}: {distance} km"
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(
                            f"Failed to calculate distance for request {request_id}"
                        )
                    )
            else:
                self.stdout.write(
                    f"Would recalculate distance for request {request_id}"
                )

        except Request.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"Request {request_id} not found"))
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error processing request {request_id}: {str(e)}")
            )

    def recalculate_all_requests(self, force, dry_run):
        """Recalculate distances for all requests."""
        self.stdout.write("Starting bulk distance recalculation...")

        # Get all requests with stops
        requests = Request.objects.filter(stops__isnull=False).distinct()
        total_requests = requests.count()

        self.stdout.write(f"Found {total_requests} requests with stops")

        updated_count = 0
        failed_count = 0
        skipped_count = 0

        for i, request in enumerate(requests, 1):
            try:
                self.stdout.write(
                    f"Processing request {request.id} ({i}/{total_requests})..."
                )

                # Skip if already has distance and not forcing
                if not force and request.estimated_distance is not None:
                    skipped_count += 1
                    self.stdout.write(f"  Skipped (already has distance)")
                    continue

                if not request.stops.exists():
                    skipped_count += 1
                    self.stdout.write(f"  Skipped (no stops)")
                    continue

                # Check valid coordinates
                valid_stops = request.stops.filter(
                    location__latitude__isnull=False, location__longitude__isnull=False
                ).count()

                if valid_stops < 2:
                    skipped_count += 1
                    self.stdout.write(f"  Skipped (insufficient valid coordinates)")
                    continue

                if not dry_run:
                    # Clear cache and calculate
                    clear_distance_cache(request)
                    distance = calculate_distance_hybrid(request, prefer_api=True)

                    if distance is not None:
                        with transaction.atomic():
                            request.estimated_distance = distance
                            request.save(update_fields=["estimated_distance"])

                        updated_count += 1
                        self.stdout.write(f"  Updated: {distance} km")
                    else:
                        failed_count += 1
                        self.stdout.write(f"  Failed to calculate distance")
                else:
                    self.stdout.write(f"  Would recalculate distance")
                    updated_count += 1

            except Exception as e:
                failed_count += 1
                self.stdout.write(self.style.ERROR(f"  Error: {str(e)}"))

        # Summary
        self.stdout.write("\n" + "=" * 50)
        self.stdout.write("RECALCULATION SUMMARY")
        self.stdout.write("=" * 50)
        self.stdout.write(f"Total requests processed: {total_requests}")
        self.stdout.write(f"Updated: {updated_count}")
        self.stdout.write(f"Failed: {failed_count}")
        self.stdout.write(f"Skipped: {skipped_count}")

        if dry_run:
            self.stdout.write(self.style.WARNING("\nDRY RUN - No changes were made"))
        else:
            self.stdout.write(self.style.SUCCESS("\nRecalculation completed!"))
