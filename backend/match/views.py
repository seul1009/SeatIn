from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Match
from .serializers import MatchSerializer

@api_view(['GET'])
def match_list(request):
    matches = Match.objects.all()                 # DB에서 전체 공연 조회
    serializer = MatchSerializer(matches, many=True, context={'request': request})
  # 모델 → JSON 변환
    return Response(serializer.data)           # 변환된 JSON 응답

@api_view(['GET'])
def match_detail(request, pk):
    try:
        match = Match.objects.get(pk=pk)
    except Match.DoesNotExist:
        return Response({'error': 'Match not found'}, status=404)
    serializer = MatchSerializer(match)
    return Response(serializer.data)