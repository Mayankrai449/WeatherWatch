import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import api from '../services/api';
import './Summary.css';

const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];

const Summary = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`summary/${selectedCity}/`);
        if (response.data && Array.isArray(response.data)) {
          setWeatherData(response.data);
        } else {
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedCity]);

  const prepareChartData = () => {
    if (!weatherData.length) return [];
    
    return weatherData.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      average: day.avg_temp,
      maximum: day.max_temp,
      minimum: day.min_temp,
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!weatherData.length) return <div className="error">No data available for this city</div>;

  return (
    <div className="weather-container">
      <div className="header">
        <h2>Weather Summary</h2>
        <select 
          value={selectedCity} 
          onChange={(e) => setSelectedCity(e.target.value)}
          className="city-select"
        >
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="weather-cards">
        {weatherData.map(day => (
          <div key={day.id} className="weather-card">
            <h3>{new Date(day.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}</h3>
            <p>Average: {day.avg_temp}°C</p>
            <p>High: {day.max_temp}°C</p>
            <p>Low: {day.min_temp}°C</p>
            <p>{day.conditions}</p>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={prepareChartData()}>
            <XAxis dataKey="date" />
            <YAxis unit="°C" />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="maximum" 
              stroke="#ff4444" 
              name="Max Temp" 
            />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="#4444ff" 
              name="Avg Temp" 
            />
            <Line 
              type="monotone" 
              dataKey="minimum" 
              stroke="#44aa44" 
              name="Min Temp" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Summary;