import React from 'react';
import { Link } from 'react-router-dom';
import './TopMenuBar.css';
import '../../src/styles/Home.css';

const TopMenuBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="top-menu-bar text-center">
            <div className="Ham" onClick={toggleMenu}>☰</div>
            <div className="menu-items">
                <Link to="/" className="menu-item" onClick={closeMenu}>Home</Link>
                <Link to="/jobs" className="menu-item" onClick={closeMenu}>Jobs</Link>
                <Link to="/dashboard" className="menu-item" onClick={closeMenu}>Dashboard</Link>
                <Link to="/search" className="menu-item" onClick={closeMenu}>Search</Link>
            </div>
            <div className="auth-buttons">
                <Link to="/login">
                    <button className="button">Login</button>
                </Link>
                <Link to="/register">
                    <button className="button">Register</button>
                </Link>
            </div>
        </div>
    );
};

export default TopMenuBar;
