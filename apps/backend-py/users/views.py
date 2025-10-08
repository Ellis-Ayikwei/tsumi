from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer, AgentKYCSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ["create", "register"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        """User registration endpoint"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def submit_kyc(self, request, pk=None):
        """Submit KYC documents for agent verification"""
        user = self.get_object()
        if user.user_type != "agent":
            return Response(
                {"error": "Only agents can submit KYC"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = AgentKYCSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "KYC submitted successfully. Awaiting admin verification."}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


