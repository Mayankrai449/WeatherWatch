import requests
from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from .models import *
from django.conf import settings

@shared_task
def fetch_weather_data():
    cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"]
    api_key = settings.OPENWEATHERMAP_API_KEY
    
    for city in cities:
        response = requests.get(f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}")
        data = response.json()
        
        WeatherReading.objects.create(
            city=city,
            timestamp=timezone.now(),
            temperature=data["main"]["temp"] - 273.15,
            feels_like=data["main"]["feels_like"] - 273.15,
            main_condition=data["weather"][0]["main"],
            humidity=data["main"].get("humidity"),
            wind_speed=data["wind"].get("speed"),
        )