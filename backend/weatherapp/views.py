from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .models import *
from .serializers import *

class LiveWeatherView(APIView):
    def get(self, request, city):
        cache_key = f"live_weather_{city}"
        data = cache.get(cache_key)                                 # Check if the data is cached

        if not data:
            readings = WeatherReading.objects.filter(city=city).order_by('-timestamp')[:1]              # Get the latest reading
            if readings.exists():
                data = WeatherReadingSerializer(readings.first()).data                                  
                cache.set(cache_key, data, timeout=300)

        return Response(data, status=status.HTTP_200_OK)

class DailySummaryView(APIView):
    def get(self, request, city):
        cache_key = f"daily_summary_{city}"
        data = cache.get(cache_key)

        if not data:
            summaries = DailyWeatherSummary.objects.filter(city=city).order_by('-date')[:7]         # Get the last 7 days' summaries
            data = DailyWeatherSummarySerializer(summaries, many=True).data
            cache.set(cache_key, data, timeout=300)

        return Response(data, status=status.HTTP_200_OK)
    
class AlertCreateAPIView(APIView):
    def post(self, request):
        serializer = AlertConfigurationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()                                                   # Save the alert configuration
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AlertListAPIView(APIView):
    def get(self, request):
        alerts = AlertConfiguration.objects.all().order_by('-enabled')
        serializer = AlertConfigurationSerializer(alerts, many=True)             # Get all the alerts
        return Response(serializer.data, status=status.HTTP_200_OK)