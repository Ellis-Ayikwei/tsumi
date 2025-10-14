"""
New API endpoints for instant request flow
Maintains backward compatibility with existing request system
"""

import json
import uuid
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from .models import Request
from .serializer import RequestSerializer
from apps.JourneyStop.models import JourneyStop
from apps.Location.models import Location
from apps.RequestItems.models import RequestItem
from apps.CommonItems.models import ItemCategory
from apps.Location.services import get_distance_and_travel_time
from apps.pricing.services import PricingService
from .utils.utils import get_request_forecast_data
import logging

logger = logging.getLogger(__name__)


class InstantRequestViewSet(viewsets.ModelViewSet):
    """
    New ViewSet specifically for instant request flow
    Maintains backward compatibility with existing RequestViewSet
    """

    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"])
    def create_instant_request(self, request):
        """
        Create a new instant request with service details
        POST /api/instant-requests/create/
        """
        try:
            data = request.data.copy()
            print(json.dumps(data, indent=4))
            data["request_type"] = "instant"
            data["status"] = "draft"

            # Generate tracking number
            tracking_number = f"IR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
            data["tracking_number"] = tracking_number

            # Create request
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()

            # Create journey stops if provided
            journey_stops = data.get("journey_stops", [])
            print("creating journey stops")
            # Calculate distance and time if locations are provided
            if len(journey_stops) >= 2:
                self._calculate_distance_and_time(instance)

            return Response(
                {
                    "message": "Instant request created successfully",
                    "request_id": str(instance.id),
                    "tracking_number": instance.tracking_number,
                    "status": instance.status,
                    "estimated_distance": (
                        float(instance.estimated_distance)
                        if instance.estimated_distance
                        else None
                    ),
                    "estimated_duration": (
                        str(instance.estimated_duration)
                        if instance.estimated_duration
                        else None
                    ),
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.error(f"Error creating instant request: {str(e)}")
            return Response(
                {"error": f"Failed to create instant request: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"])
    def submit_inventory(self, request, pk=None):
        """
        Submit inventory items for instant request
        POST /api/instant-requests/{id}/submit-inventory/
        """
        try:
            instance = self.get_object()
            moving_items = request.data.get("moving_items", [])

            if not moving_items:
                return Response(
                    {"error": "Moving items are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Clear existing items
            instance.items.all().delete()

            # Get pickup and dropoff stops
            pickup_stop = instance.stops.filter(type="pickup").first()
            dropoff_stop = instance.stops.filter(type="dropoff").first()

            if not pickup_stop or not dropoff_stop:
                return Response(
                    {"error": "Pickup and dropoff locations are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create request items
            created_items = []
            for item_data in moving_items:
                # Get or create item category
                category_name = item_data.get("category", "Other")
                category, _ = ItemCategory.objects.get_or_create(name=category_name)

                # Handle photos if present
                photos = []
                if item_data.get("photo"):
                    photos.append(item_data["photo"])

                # Convert weight and value to decimal
                try:
                    weight = (
                        float(item_data.get("weight", 0))
                        if item_data.get("weight")
                        else None
                    )
                except (ValueError, TypeError):
                    weight = None

                try:
                    declared_value = (
                        float(item_data.get("value", 0))
                        if item_data.get("value")
                        else None
                    )
                except (ValueError, TypeError):
                    declared_value = None

                # Create request item
                request_item = RequestItem.objects.create(
                    request=instance,
                    category=category,
                    name=item_data.get("name", ""),
                    description=item_data.get("description", ""),
                    quantity=item_data.get("quantity", 1),
                    weight=weight,
                    dimensions=item_data.get("dimensions", ""),
                    fragile=item_data.get("fragile", False),
                    needs_disassembly=item_data.get("needs_disassembly", False),
                    special_instructions=item_data.get("special_instructions", ""),
                    photos=photos,
                    declared_value=declared_value,
                    pickup_stop=pickup_stop,
                    dropoff_stop=dropoff_stop,
                )
                created_items.append(request_item)

            # Update request with moving items
            instance.moving_items = moving_items
            instance.save()

            return Response(
                {
                    "message": "Inventory submitted successfully",
                    "request_id": str(instance.id),
                    "items_count": len(created_items),
                    "moving_items": moving_items,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error submitting inventory: {str(e)}")
            return Response(
                {"error": f"Failed to submit inventory: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"])
    def get_price_forecast(self, request, pk=None):
        """
        Get price forecast for instant request
        POST /api/instant-requests/{id}/price-forecast/
        """
        try:
            instance = self.get_object()

            # Get forecast data from the request
            forecast_data = get_request_forecast_data(instance)

            # Add any additional parameters from the request
            if hasattr(request, "data") and request.data:
                forecast_data.update(request.data)

            logger.info(
                f"Price forecast data for request {instance.id}: {json.dumps(forecast_data, indent=4)}"
            )

            # Calculate price forecast using PricingService
            forecast_response = PricingService.calculate_price_forecast(forecast_data)

            return Response(
                {
                    "message": "Price forecast calculated successfully",
                    "request_id": str(instance.id),
                    "request_type": instance.request_type,
                    "estimated_distance": (
                        float(instance.estimated_distance)
                        if instance.estimated_distance
                        else None
                    ),
                    "estimated_duration": (
                        str(instance.estimated_duration)
                        if instance.estimated_duration
                        else None
                    ),
                    "price_forecast": forecast_response.data,
                    "forecast_metadata": {
                        "vehicle_type": forecast_data.get("vehicle_type"),
                        "total_weight": forecast_data.get("weight"),
                        "service_level": forecast_data.get("service_level"),
                        "property_type": forecast_data.get("property_type"),
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Price forecast error: {str(e)}")
            return Response(
                {
                    "error": f"Failed to calculate price forecast: {str(e)}",
                    "request_id": pk,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"])
    def accept_price(self, request, pk=None):
        """
        Accept a price for instant request
        POST /api/instant-requests/{id}/accept-price/
        """
        try:
            instance = self.get_object()

            # Get the price and staff count from the request
            price = request.data.get("total_price")
            staff_count = request.data.get("staff_count")
            selected_date = request.data.get("selected_date")

            if not all([price, staff_count, selected_date]):
                return Response(
                    {"error": "Price, staff count, and selected date are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Convert selected_date string to datetime.date object
            try:
                selected_date = datetime.strptime(selected_date, "%Y-%m-%d").date()
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Expected YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Calculate the base price using our pricing function
            base_price = instance.calculate_base_price()

            # Update the request with the accepted price and staff count
            instance.final_price = price
            instance.staff_required = staff_count
            instance.preferred_pickup_date = selected_date
            instance.base_price = base_price
            instance.status = "accepted"
            instance.save()

            return Response(
                {
                    "message": "Price accepted successfully",
                    "request_id": str(instance.id),
                    "final_price": float(instance.final_price),
                    "staff_count": instance.staff_required,
                    "selected_date": instance.preferred_pickup_date,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error accepting price: {str(e)}")
            return Response(
                {"error": f"Failed to accept price: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"])
    def submit_booking_details(self, request, pk=None):
        """
        Submit final booking details for instant request
        POST /api/instant-requests/{id}/submit-booking-details/
        """
        try:
            instance = self.get_object()

            # Update request with booking details
            instance.contact_name = request.data.get("name", instance.contact_name)
            instance.contact_email = request.data.get("email", instance.contact_email)
            instance.contact_phone = request.data.get("phone", instance.contact_phone)
            instance.staff_required = request.data.get(
                "staff_count", instance.staff_required
            )
            instance.is_business = request.data.get("is_business", False)

            # Update journey stops if provided
            journey_stops = request.data.get("journey_stops", [])
            if journey_stops:
                self._update_journey_stops(instance, journey_stops)

            # Update moving items if provided
            moving_items = request.data.get("moving_items", [])
            if moving_items:
                instance.moving_items = moving_items
                instance.save()

            # Update selected price and date
            selected_price = request.data.get("selected_price")
            selected_date = request.data.get("selected_date")

            if selected_price:
                instance.final_price = selected_price
            if selected_date:
                try:
                    selected_date = datetime.strptime(selected_date, "%Y-%m-%d").date()
                    instance.preferred_pickup_date = selected_date
                except ValueError:
                    pass  # Ignore invalid date format

            instance.save()

            return Response(
                {
                    "message": "Booking details submitted successfully",
                    "request_id": str(instance.id),
                    "status": instance.status,
                    "final_price": (
                        float(instance.final_price) if instance.final_price else None
                    ),
                    "selected_date": instance.preferred_pickup_date,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error submitting booking details: {str(e)}")
            return Response(
                {"error": f"Failed to submit booking details: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def _create_journey_stops(self, instance, journey_stops):
        """Helper method to create journey stops"""
        logger.info(f"Creating journey stops for request ID: {instance.id}")

        for idx, stop_data in enumerate(journey_stops):
            # Create location
            location = Location.objects.create(
                address=stop_data.get("address", ""),
                address_line1=stop_data.get("address_line1", ""),
                address_line2=stop_data.get("address_line2", ""),
                city=stop_data.get("city", ""),
                county=stop_data.get("county", ""),
                postcode=stop_data.get("postcode", ""),
                contact_name=stop_data.get("contact_name", ""),
                contact_phone=stop_data.get("contact_phone", ""),
                use_main_contact=stop_data.get("use_main_contact", True),
            )

            # Create journey stop
            JourneyStop.objects.create(
                request=instance,
                location=location,
                type=stop_data.get("type", "pickup" if idx == 0 else "dropoff"),
                sequence=idx,
            )

    def _update_journey_stops(self, instance, journey_stops):
        """Helper method to update journey stops"""
        logger.info(f"Updating journey stops for request ID: {instance.id}")

        # Get existing stops
        existing_stops = list(instance.stops.all().order_by("sequence"))

        for idx, stop_data in enumerate(journey_stops):
            if idx < len(existing_stops):
                # Update existing location
                location = existing_stops[idx].location
                location.address = stop_data.get("address", location.address)
                location.address_line1 = stop_data.get(
                    "address_line1", location.address_line1
                )
                location.address_line2 = stop_data.get(
                    "address_line2", location.address_line2
                )
                location.city = stop_data.get("city", location.city)
                location.county = stop_data.get("county", location.county)
                location.postcode = stop_data.get("postcode", location.postcode)
                location.contact_name = stop_data.get(
                    "contact_name", location.contact_name
                )
                location.contact_phone = stop_data.get(
                    "contact_phone", location.contact_phone
                )
                location.use_main_contact = stop_data.get(
                    "use_main_contact", location.use_main_contact
                )
                location.save()

                # Update existing journey stop
                journey_stop = existing_stops[idx]
                journey_stop.type = stop_data.get("type", journey_stop.type)
                journey_stop.sequence = idx
                journey_stop.save()
            else:
                # Create new location and stop if we have more stops than existing ones
                location = Location.objects.create(
                    address=stop_data.get("address", ""),
                    address_line1=stop_data.get("address_line1", ""),
                    address_line2=stop_data.get("address_line2", ""),
                    city=stop_data.get("city", ""),
                    county=stop_data.get("county", ""),
                    postcode=stop_data.get("postcode", ""),
                    contact_name=stop_data.get("contact_name", ""),
                    contact_phone=stop_data.get("contact_phone", ""),
                    use_main_contact=stop_data.get("use_main_contact", True),
                )

                JourneyStop.objects.create(
                    request=instance,
                    location=location,
                    type=stop_data.get("type", "pickup"),
                    sequence=idx,
                )

        # Delete any extra stops that are no longer needed
        if len(existing_stops) > len(journey_stops):
            for stop in existing_stops[len(journey_stops) :]:
                stop.delete()

    def _calculate_distance_and_time(self, instance):
        """Helper method to calculate distance and time between locations"""
        try:
            stops = instance.stops.order_by("sequence").select_related("location")
            locations = [
                s.location
                for s in stops
                if s.location and s.location.latitude and s.location.longitude
            ]

            if len(locations) >= 2:
                result = get_distance_and_travel_time(locations)
                logger.info(f"Distance API result: {result}")

                distance_miles = result["distance"]
                duration_sec = result["duration"]
                fuel_used = result["estimated_fuel_liters"]

                instance.estimated_distance = distance_miles
                instance.estimated_fuel_consumption = fuel_used
                instance.estimated_duration = timedelta(seconds=duration_sec)

                if instance.preferred_pickup_date:
                    start_dt = datetime.combine(
                        instance.preferred_pickup_date, datetime.min.time()
                    )
                    instance.estimated_completion_time = start_dt + timedelta(
                        seconds=duration_sec
                    )
                else:
                    instance.estimated_completion_time = timezone.now() + timedelta(
                        seconds=duration_sec
                    )

                instance.save(
                    update_fields=[
                        "estimated_distance",
                        "estimated_fuel_consumption",
                        "estimated_duration",
                        "estimated_completion_time",
                    ]
                )
        except Exception as e:
            logger.error(f"Error calculating distance and time: {e}")

    def partial_update(self, request, pk=None):
        """
        Update an existing instant request
        PATCH /api/instant-requests/{id}/
        """
        try:
            # Get the existing request
            request_obj = get_object_or_404(Request, pk=pk)

            # Only allow updates to draft requests
            if request_obj.status != "draft":
                return Response(
                    {"error": "Only draft requests can be updated"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Update the request with new data
            # If journey stops are being updated, delete existing ones first
            if "journey_stops" in request.data:
                # Delete existing journey stops before serializer processes new ones
                JourneyStop.objects.filter(request=request_obj).delete()

            serializer = self.get_serializer(
                request_obj, data=request.data, partial=True
            )
            if serializer.is_valid():
                updated_request = serializer.save()

                # Recalculate distance and time if locations changed
                if any(
                    field in request.data
                    for field in [
                        "pickup_location",
                        "dropoff_location",
                        "journey_stops",
                    ]
                ):
                    self._calculate_distance_and_time(updated_request)

                return Response(
                    {
                        "id": updated_request.id,
                        "request_id": str(updated_request.id),
                        "status": updated_request.status,
                        "message": "Request updated successfully",
                    }
                )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error updating request: {e}")
            return Response(
                {"error": f"Failed to update request: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
