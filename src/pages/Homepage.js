import React from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/Home.css';
import TopMenuBar from './TopMenuBar';

const HomePage = () => {
    return (
        <>
            <TopMenuBar />
            <div className="backgroundStyle">
                <div className="overlay"></div>
                <div className="content">
                    <img src="/assets/images/logo-no-background.png" alt="Estines" style={{ height: '60px', width: 'auto' }} />
                    <h1>Find Your Next Opportunity</h1>
                    <p>Browse open positions and apply with ease.</p>
                    <Link to="/all-jobs">
                        <button style={{
                            padding: '12px 32px',
                            background: '#f9fafb',
                            color: '#111827',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'opacity 0.15s'
                        }}
                            onMouseOver={e => e.target.style.opacity = '0.88'}
                            onMouseOut={e => e.target.style.opacity = '1'}
                        >
                            Browse Jobs
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default HomePage;