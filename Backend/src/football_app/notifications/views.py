from django.shortcuts import render, redirect
from django.http import HttpResponse
# Create your views here.
# inca nu face nimic ce e aici
def notifications_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        return render(request, "notifications.html", {})
    else:
        return redirect('login')