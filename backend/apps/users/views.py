from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserRegisterSerializer, UserProfileSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer

class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

class ProfilePictureUploadView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()
        if 'profile_picture' in request.data:
            profile.profile_picture = request.data['profile_picture']
            profile.save()
            return Response(self.get_serializer(profile).data)
        return Response({"error": "No picture provided"}, status=status.HTTP_400_BAD_REQUEST)
