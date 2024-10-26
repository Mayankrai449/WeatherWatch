from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .models import *
from .serializers import *

class LiveWeatherView(APIView):
    def get(self, request, city):
        cache_key = f"live_weather_{city}"
        data = cache.get(cache_key)

        if not data:
            readings = WeatherReading.objects.filter(city=city).order_by('-timestamp')[:1]
            if readings.exists():
                data = WeatherReadingSerializer(readings.first()).data
                cache.set(cache_key, data, timeout=30)

        return Response(data, status=status.HTTP_200_OK)

class DailySummaryView(APIView):
    def get(self, request, city):
        cache_key = f"daily_summary_{city}"
        data = cache.get(cache_key)

        if not data:
            summaries = DailyWeatherSummary.objects.filter(city=city).order_by('-date')[:7]
            data = DailyWeatherSummarySerializer(summaries, many=True).data
            cache.set(cache_key, data, timeout=3600)

        return Response(data, status=status.HTTP_200_OK)
