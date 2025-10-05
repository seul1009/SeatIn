from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import Member

class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['username'] = self.validated_data.get('username', '')
        data['phone'] = self.validated_data.get('phone', '')
        return data

    def save(self, request):
        user = super().save(request)
        user.username = self.validated_data.get("username", "")
        user.phone = self.validated_data.get("phone", None)
        user.save()
        return user
