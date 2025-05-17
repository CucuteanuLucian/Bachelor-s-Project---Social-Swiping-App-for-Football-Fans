from django.urls import path
#from .views import UserSettingsView
from django.conf import settings
from django.conf.urls.static import static
from .views import get_user_details, get_all_users, update_user_profile

# endpoint-uri url care ia datele utilizatorului, updateaza detaliile, sau ia toti utilizatorii din proximitate (max_distance) eligibili utilizatorului
urlpatterns = [
    path('user/<str:username>/', get_user_details, name='user-details'),
    path('user/<str:username>/settings/', update_user_profile, name='user-settings'),
    path('get-users-for/<str:username>/', get_all_users, name='all-users'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

