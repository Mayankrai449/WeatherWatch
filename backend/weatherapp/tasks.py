import requests
from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.db.models import Avg, Max, Min
from collections import Counter
from .models import *
from django.conf import settings

@shared_task
def fetch_weather_data():
    cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"]
    api_key = settings.OPENWEATHERMAP_API_KEY
    
    for city in cities:
        response = requests.get(f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}")   # Fetch the weather data
        data = response.json()
        
        reading = WeatherReading.objects.create(                                           # Create a new reading 
            city=city,
            timestamp=timezone.now(),
            temperature=data["main"]["temp"] - 273.15,
            feels_like=data["main"]["feels_like"] - 273.15,
            main_condition=data["weather"][0]["main"],
            humidity=data["main"].get("humidity"),
            wind_speed=data["wind"].get("speed"),
        )
        
        alert_threshold_checker.delay(city, reading.id)                                 # Check for alert thresholds
        
@shared_task
def save_daily_weather_summary():
    cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"]
    today = timezone.now().date()

    for city in cities:
        readings = WeatherReading.objects.filter(                   # Filter the readings for the city and date
            city=city,  
            timestamp__date=today
        )

        if readings.exists():
            avg_temp = readings.aggregate(Avg('temperature'))['temperature__avg']
            max_temp = readings.aggregate(Max('temperature'))['temperature__max']
            min_temp = readings.aggregate(Min('temperature'))['temperature__min']

            conditions = readings.values_list('main_condition', flat=True)
            dominant_condition = Counter(conditions).most_common(1)[0][0]               # Get the most common condition
            
            summary, created = DailyWeatherSummary.objects.update_or_create(            # Update or create the summary
                city=city,
                date=today,
                defaults={
                    'avg_temp': avg_temp,
                    'max_temp': max_temp,
                    'min_temp': min_temp,
                    'dominant_condition': dominant_condition,
                    'conditions': list(conditions),
                    'readings_count': readings.count(),
                }
            )
            

@shared_task
def alert_threshold_checker(city, reading_id):

    reading = WeatherReading.objects.get(id=reading_id)
    alerts = AlertConfiguration.objects.filter(city=city, enabled=True)

    for alert in alerts:
        alert_triggered = False

        # Threshold check based on the condition type
        if alert.condition_type == 'temperature' and reading.temperature > alert.threshold:
            alert_triggered = True
        elif alert.condition_type == 'wind_speed' and reading.wind_speed > alert.threshold:
            alert_triggered = True
        elif alert.condition_type == 'humidity' and reading.humidity > alert.threshold:
            alert_triggered = True

        if alert_triggered:
            trigger_alert(alert)           # Trigger the alert

def trigger_alert(alert):

    print(f"Alert Triggered: {alert.name} - {alert.condition_type} threshold exceeded in {alert.city}.")