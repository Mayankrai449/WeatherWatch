from django.urls import path
from . import views

urlpatterns = [
    path('live/<str:city>/', views.LiveWeatherView.as_view()),
    path('summary/<str:city>/', views.DailySummaryView.as_view()),
    path('alert/', views.AlertCreateAPIView.as_view()),
    path('alert/get/', views.AlertListAPIView.as_view()),
]