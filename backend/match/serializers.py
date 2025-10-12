from rest_framework import serializers
from django.conf import settings
from .models import Match

class MatchSerializer(serializers.ModelSerializer):
    poster1_url = serializers.SerializerMethodField()
    poster2_url = serializers.SerializerMethodField()

    class Meta:
        model = Match
        ordering = ["date"]
        fields = [
            "id",
            "title",
            "category",
            "poster1_url",
            "poster2_url",
            "date",
            "location",
        ]

    # ✅ 원정팀 로고 (poster1)
    def get_poster1_url(self, obj):
        request = self.context.get("request")
        if obj.poster1:
            url = obj.poster1  # 문자열 형태 URL
        else:
            url = f"{settings.MEDIA_URL}posters/default.png"
        return request.build_absolute_uri(url) if request else url

    # ✅ 홈팀 로고 (poster2)
    def get_poster2_url(self, obj):
        request = self.context.get("request")
        if obj.poster2:
            url = obj.poster2
        else:
            url = f"{settings.MEDIA_URL}posters/default.png"
        return request.build_absolute_uri(url) if request else url
