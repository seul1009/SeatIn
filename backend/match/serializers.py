from rest_framework import serializers
from django.conf import settings
import os
from .models import Match

class MatchSerializer(serializers.ModelSerializer):
    poster = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = '__all__'

    def get_poster(self, obj):
        request = self.context.get('request')
        file_path = os.path.join(settings.MEDIA_ROOT, str(obj.poster)) if obj.poster else None

        if obj.poster and file_path and os.path.exists(file_path):
            url = obj.poster.url
        else:
            url = f"{settings.MEDIA_URL}posters/default.png"

        if request:
            #  현재 요청 경로(/api/match/)를 제거하고 절대 루트 기준으로 URL 생성
            return request.build_absolute_uri('/')[:-1] + url
        return url
