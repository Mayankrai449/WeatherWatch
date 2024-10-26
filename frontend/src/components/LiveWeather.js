import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../services/api';

const LiveWeather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await api.get('/weather/live');
        setWeatherData(response.data);

        setChartData({
          labels: response.data.map(item => new Date(item.timestamp).toLocaleTimeString()),
          datasets: [
            {
              label: 'Temperature (°C)',
              data: response.data.map(item => item.temperature),
              borderColor: 'blue',
              fill: false,
            },
          ],
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load live weather data.');
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div>
      <h3>Live Weather Data</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <Line data={chartData} />
      )}
    </div>
  );
};

export default LiveWeather;
