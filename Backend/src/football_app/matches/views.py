import uuid

from django.contrib.auth.models import User  # asigură-te că ai importat
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Swipe, Match
from .serializers import SwipeSerializer

# functie pentru a obtine swipe-urile unui utilizator dupa nume
@api_view(['GET'])
@permission_classes([AllowAny])
def get_swipes(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    swipes = Swipe.objects.filter(user_from=user)
    serializer = SwipeSerializer(swipes, many=True)
    return Response(serializer.data)

# functia care creaza un swipe, daca ai dat like, verifica daca este reciproc like-ul, daca da, creeaza un match
@api_view(['POST'])
@permission_classes([AllowAny])
def create_swipes(request):
    serializer = SwipeSerializer(data=request.data)
    if serializer.is_valid():
        swipe = serializer.save()
        from_user = swipe.user_from
        to_user = swipe.user_to

        match_found = False
        match_data = None


        if swipe.swipe_type == 'like':
            previous_swipes_by_to_user = Swipe.objects.filter(user_from=to_user, swipe_type='like')
            if previous_swipes_by_to_user.filter(user_to=from_user).exists():
                match_found = True
                Match.objects.get_or_create(
                    user1=min(from_user, to_user, key=lambda u: u.id),
                    user2=max(from_user, to_user, key=lambda u: u.id),
                    defaults={'room_id': uuid.uuid4()}
                )
                match_data = {
                    "room_id": str(Match.room_id)
                }

        return Response({
            'swipe': SwipeSerializer(swipe).data,
            'match': match_found,
            'match_id': match_data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# functie care obtine toate match-urile unui utilizator dupa nume
@api_view(['GET'])
@permission_classes([AllowAny])
def get_matches(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=404)

    matches = Match.objects.filter(user1=user) | Match.objects.filter(user2=user)

    matched_users = [
        {"username": match.user1.username, "room_id": match.room_id}
        if match.user2 == user else
        {"username": match.user2.username, "room_id": match.room_id}
        for match in matches
    ]

    return Response(matched_users)

