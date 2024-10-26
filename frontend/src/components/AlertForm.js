// /src/components/AlertForm.js
import React, { useState } from 'react';
import api from '../services/api';

const AlertForm = () => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Delhi');
  const [criteria, setCriteria] = useState('temperature');
  const [threshold, setThreshold] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    await api.post('/alerts/create', {
      name,
      city,
      condition_type: criteria,
      threshold: parseFloat(threshold),
    });

    alert('Alert configuration saved!');
  };

  return (
    <div>
      <h3>Alert Configuration</h3>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alert Name"
          required
        />
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Chennai">Chennai</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Hyderabad">Hyderabad</option>
        </select>
        <select value={criteria} onChange={(e) => setCriteria(e.target.value)}>
          <option value="temperature">Temperature</option>
          <option value="wind_speed">Wind Speed</option>
          <option value="humidity">Humidity</option>
        </select>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="Threshold Value"
          required
        />
        <button type="submit">Save Alert</button>
      </form>
    </div>
  );
};

export default AlertForm;
