// /src/App.js
import React from 'react';
import './App.css';
import LiveWeather from './components/LiveWeather';
import WeatherSummary from './components/WeatherSummary';
import AlertForm from './components/AlertForm';

function App() {
  return (
    <div className="App">
      <h1>Weather Monitoring Dashboard</h1>
      <div className="weather-container">
        <LiveWeather />
        <WeatherSummary />
      </div>
      <AlertForm />
    </div>
  );
}

export default App;
