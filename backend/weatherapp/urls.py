from django.urls import path
from . import views

urlpatterns = [
    path('live/<str:city>/', views.LiveWeatherView.as_view()),
]