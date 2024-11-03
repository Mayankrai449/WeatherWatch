import React, { useState } from 'react';
import api from '../services/api';
import './AlertForm.css';

const AlertForm = ({ onCreateAlert }) => {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [conditionType, setConditionType] = useState('temperature');
    const [threshold, setThreshold] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('alert/', {
                name,
                city,
                condition_type: conditionType,
                threshold,
            });

            onCreateAlert(response.data); // Automatically update the existing alert list
            setName('');
            setCity('');
            setThreshold('');
        } catch (error) {
            console.error('Error creating alert:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alert Name"
                required
            />
            <select value={city} onChange={(e) => setCity(e.target.value)} required>
                <option value="">Select City</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
            </select>
            <select value={conditionType} onChange={(e) => setConditionType(e.target.value)} required>
                <option value="temperature">Temperature</option>
                <option value="wind_speed">Wind Speed</option>
                <option value="humidity">Humidity</option>
            </select>
            <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="Threshold"
                required
            />
            <button type="submit">Create Alert</button>
        </form>
    );
};

export default AlertForm;
