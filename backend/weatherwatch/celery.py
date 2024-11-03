from __future__ import absolute_import
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'weatherwatch.settings')
import django
django.setup()

app = Celery('weatherwatch')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(['weatherapp'])

@app.task(bind=True)
def fetch_weather_data_task(self):
    from weatherapp.tasks import fetch_weather_data
    return fetch_weather_data()

@app.task(bind=True)
def save_daily_weather_summary_task(self):
    from weatherapp.tasks import save_daily_weather_summary
    return save_daily_weather_summary()

fetch_weather_data_task.delay()
save_daily_weather_summary_task.delay()
