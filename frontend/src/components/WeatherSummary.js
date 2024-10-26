import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';

const WeatherSummary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await api.get('/weather/daily-summary');
        setSummaryData(response.data);

        setChartData({
          labels: response.data.map(item => item.date),
          datasets: [
            {
              label: 'Average Temperature (°C)',
              data: response.data.map(item => item.avg_temp),
              backgroundColor: 'orange',
            },
            {
              label: 'Humidity (%)',
              data: response.data.map(item => item.humidity),
              backgroundColor: 'green',
            },
          ],
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load daily weather summary.');
      }
    };

    fetchSummaryData();
  }, []);

  return (
    <div>
      <h3>Daily Weather Summary</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <Bar data={chartData} />
      )}
    </div>
  );
};

export default WeatherSummary;
