import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OtpVerify from '../components/shared/OtpVerify';
import './R-L.css';

const ForgotPassword = () => {
    const navigate = useNavigate();

    return (
        <div className="form-container">
            <div className="card p-2">
                <img src="/assets/images/logo-black.png" alt="Estines" />
                <h2 className="text-base font-semibold text-gray-900 mb-1">Forgot Password</h2>
                <p className="text-xs text-gray-500 mb-4">We'll send an OTP to your registered email.</p>

                <OtpVerify onSuccess={() => navigate('/login')} />

                <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                    <Link to="/login" style={{ color: '#2563eb', fontWeight: 500 }}>Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
