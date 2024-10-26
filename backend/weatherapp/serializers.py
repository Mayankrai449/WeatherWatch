from rest_framework import serializers
from .models import WeatherReading, DailyWeatherSummary, AlertConfiguration

class WeatherReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherReading
        fields = '__all__'

class DailyWeatherSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyWeatherSummary
        fields = '__all__'

class AlertConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertConfiguration
        fields = '__all__'
