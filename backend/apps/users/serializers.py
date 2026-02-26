from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    
    class Meta:
        model = UserProfile
        fields = ['username', 'profile_picture', 'bio', 'simulations_count', 'survival_rate', 'peak_stability']
        read_only_fields = ['simulations_count', 'survival_rate', 'peak_stability']

    def validate_username(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Username must contain only alphabetic characters.")
        if User.objects.filter(username=value).exclude(id=self.instance.user.id).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            username = user_data.get('username')
            if username:
                instance.user.username = username
                instance.user.save()
        return super().update(instance, validated_data)
