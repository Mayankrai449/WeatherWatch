import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
    <nav className="navbar">
        <ul className="nav-links">
            <li><Link to="/">Live Weather</Link></li>
            <li><Link to="/summary">Summary</Link></li>
            <li><Link to="/alerts">Alerts</Link></li>
        </ul>
    </nav>
);

export default Navbar;
