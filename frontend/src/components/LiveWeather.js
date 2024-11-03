import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './LiveWeather.css';

const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];
const REFRESH_INTERVAL = 5 * 60 * 1000 + 2000;

const LiveWeather = () => {
    const [city, setCity] = useState('Delhi');
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchWeatherData = async (selectedCity) => {
        try {
            setIsLoading(true);
            const response = await api.get(`live/${selectedCity}`);
            setWeatherData(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchWeatherData(city);

        const intervalId = setInterval(() => {
            fetchWeatherData(city);
        }, REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [city]);

    // Format temperature to one decimal place
    const formattedTemperature = weatherData ? weatherData.temperature.toFixed(1) : null;

    // Determine the icon URL based on weather condition
    const iconUrl = weatherData ? `/icons/${weatherData.main_condition.toLowerCase()}.png` : '/icons/default.png';

    // Format last updated time
    const formatLastUpdated = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString();
    };

    return (
        <div className="live-weather-container">
            <h2>Live Weather</h2>

            <div className="weather-card">
                {/* Dropdown to select city fixed at the top */}
                <select 
                    className="city-dropdown" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isLoading}
                >
                    {cities.map((cityName) => (
                        <option key={cityName} value={cityName}>{cityName}</option>
                    ))}
                </select>

                {/* Display weather info */}
                {isLoading && !weatherData ? (
                    <div className="loading">
                        <p>Loading...</p>
                    </div>
                ) : weatherData ? (
                    <div className="weather-info">
                        <img src={iconUrl} alt={weatherData.main_condition} className="weather-icon" />
                        <h3>{city}</h3>
                        <p>{weatherData.main_condition}</p>
                        <h2>{formattedTemperature} °C</h2>
                        <p>Humidity: {weatherData.humidity}%</p>
                        <p>Wind Speed: {weatherData.wind_speed} m/s</p>
                        {lastUpdated && (
                            <p className="last-updated">
                                Last updated: {formatLastUpdated(lastUpdated)}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="error">
                        <p>Failed to load weather data</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveWeather;