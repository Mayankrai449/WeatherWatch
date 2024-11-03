import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiveWeather from './components/LiveWeather';
import Summary from './components/Summary';
import Alerts from './components/Alerts';
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<LiveWeather />} />
                    <Route path="/summary" element={<Summary />} />
                    <Route path="/alerts" element={<Alerts />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
