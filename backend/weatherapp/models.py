from django.db import models
from django.contrib.postgres.fields import ArrayField

class WeatherReading(models.Model):
    city = models.CharField(max_length=100)
    timestamp = models.DateTimeField()
    temperature = models.FloatField()
    feels_like = models.FloatField()
    main_condition = models.CharField(max_length=50)
    humidity = models.FloatField(null=True)
    wind_speed = models.FloatField(null=True)

    class Meta:
        db_table = 'weather_readings'
        indexes = [models.Index(fields=['city', 'timestamp'])]

class DailyWeatherSummary(models.Model):
    city = models.CharField(max_length=100)
    date = models.DateField()
    avg_temp = models.FloatField()
    max_temp = models.FloatField()
    min_temp = models.FloatField()
    dominant_condition = models.CharField(max_length=50)
    conditions = ArrayField(models.CharField(max_length=50))
    readings_count = models.IntegerField()

    class Meta:
        db_table = 'weather_daily_summary'
        unique_together = ['city', 'date']

class AlertConfiguration(models.Model):
    CONDITION_CHOICES = [
        ('temperature', 'Temperature'),
        ('wind_speed', 'Wind Speed'),
        ('humidity', 'Humidity')
    ]

    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    condition_type = models.CharField(max_length=50, choices=CONDITION_CHOICES)
    threshold = models.FloatField()
    enabled = models.BooleanField(default=True)
