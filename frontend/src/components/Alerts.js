import React, { useState, useEffect } from 'react';
import AlertForm from './AlertForm';
import api from '../services/api';
import './AlertForm.css';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);

    // Fetch existing alerts
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await api.get('alert/get/');
                setAlerts(response.data);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };

        fetchAlerts();
    }, []);

    // Update alerts without a new request
    const handleCreateAlert = (newAlert) => {
        setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    };

    // Helper function to determine unit based on condition type
    const getUnit = (conditionType) => {
        switch (conditionType) {
            case 'temperature':
                return '°C';
            case 'wind_speed':
                return 'm/s';
            case 'humidity':
                return '%';
            default:
                return '';
        }
    };

    return (
        <div className="alerts-container">
            <h2>Alerts</h2>
            <AlertForm onCreateAlert={handleCreateAlert} />
            <h3>Existing Alerts</h3>
            <ul className="alert-list">
                {alerts.map((alert, index) => (
                    <li key={index} className="alert-item">
                        {alert.name} - {alert.city} - {alert.condition_type} - Threshold: {alert.threshold}
                        {getUnit(alert.condition_type)} - {alert.enabled ? 'Enabled' : 'Disabled'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Alerts;
