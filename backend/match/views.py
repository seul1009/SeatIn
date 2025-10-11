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
def match_detail(request, pk):
    try:
        match = Match.objects.get(pk=pk)
    except Match.DoesNotExist:
        return Response({'error': 'Match not found'}, status=404)
    
    # 👇 context 추가 (포스터 절대경로 포함)
    serializer = MatchSerializer(match, context={'request': request})
    return Response(serializer.data)
