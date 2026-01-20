from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import UserRole

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer for profile display"""
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "phone_number", "date_joined"]
        read_only_fields = ["id", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ["username", "email", "password", "password_confirm", "role", "phone_number"]
    
    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def validate_role(self, value):
        if value not in dict(UserRole.choices):
            raise serializers.ValidationError(f"Invalid role. Must be one of: {dict(UserRole.choices).keys()}")
        return value
    
    def create(self, validated_data):
        validated_data.pop("password_confirm")
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        
        if not username or not password:
            raise serializers.ValidationError("Both username and password are required")
        
        return attrs


class TokenRefreshSerializer(serializers.Serializer):
    """Serializer for token refresh"""
    refresh = serializers.CharField()


class LogoutSerializer(serializers.Serializer):
    """Serializer for user logout"""
    refresh = serializers.CharField()
