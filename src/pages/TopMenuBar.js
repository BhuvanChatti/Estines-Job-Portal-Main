import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TopMenuBar.css';
import '../../src/styles/Home.css';

const TopMenuBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        closeMenu();
        navigate('/login');
    };

    return (
        <div className="top-menu-bar text-center">
            <div className="Ham" onClick={toggleMenu}>☰</div>
            <div className={`menu-items ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/" className="menu-item" onClick={closeMenu}>Home</Link>
                <Link to="/all-jobs" className="menu-item" onClick={closeMenu}>Jobs</Link>
                {isLoggedIn && <Link to="/dashboard" className="menu-item" onClick={closeMenu}>Dashboard</Link>}
            </div>
            <div className="auth-buttons">
                {isLoggedIn ? (
                    <button className="button" onClick={handleLogout}>Logout</button>
                ) : (
                    <>
                        <Link to="/login"><button className="button">Login</button></Link>
                        <Link to="/register"><button className="button">Register</button></Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default TopMenuBar;
