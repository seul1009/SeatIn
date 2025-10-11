from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Match
from .serializers import MatchSerializer

@api_view(['GET'])
def match_list(request):
    matches = Match.objects.all().order_by("date")
    serializer = MatchSerializer(matches, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def match_detail(request, match_id):
    try:
        match = Match.objects.get(id=match_id)
        serializer = MatchSerializer(match)
        return Response(serializer.data)
    except Match.DoesNotExist:
        return Response({'error': '경기 정보를 찾을 수 없습니다.'}, status=404)
    
    serializer = MatchSerializer(match, context={'request': request})
    return Response(serializer.data)

