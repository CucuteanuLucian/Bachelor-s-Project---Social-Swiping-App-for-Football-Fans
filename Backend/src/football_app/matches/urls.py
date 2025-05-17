from django.urls import path

from django.conf import settings
from django.conf.urls.static import static
from .views import get_swipes, create_swipes, get_matches

# endpoint-uri url pentru a accesa si crea swipe-uri, si pentru a accesa match-urile
urlpatterns = [
    path('swipe/<str:username>/', get_swipes, name='swipes'),
    path('swipe-create/', create_swipes, name='create-swipes'),
    path('get-matches/<str:username>/', get_matches, name='get_matches')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
