import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import Spinner from './../components/shared/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './R-L.css';

const API = process.env.REACT_APP_API_URL || 'https://estines-job-portal.onrender.com/api/v1';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { loading } = useSelector(state => state.alerts);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(showLoading());
            const { data } = await axios.post(`${API}/auth/login`, { email, password });
            dispatch(hideLoading());
            if (data.success) {
                localStorage.setItem('token', data.token);
                toast.success("Logged in successfully");
                navigate('/dashboard');
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <>
            {loading ? <Spinner /> : (
                <div className='form-container'>
                    <form className="card p-2" onSubmit={handleSubmit}>
                        <img src="/nexus-logo.svg" alt="Nexus" style={{ height: '56px', width: 'auto', marginBottom: '8px' }} />

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingRight: '44px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    style={{
                                        position: 'absolute', right: '10px', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', color: '#6b7280',
                                        fontSize: '0.8rem', padding: '0'
                                    }}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="d-flex flex-column align-items-center gap-2 mt-1">
                            <p className="mb-0" style={{ fontSize: '0.875rem' }}>
                                Not registered?{' '}
                                <Link to="/register" style={{ color: '#2563eb', fontWeight: 500 }}>Register Here</Link>
                            </p>
                            <p className="mb-0" style={{ fontSize: '0.875rem' }}>
                                <Link to="/forgot-password" style={{ color: '#6b7280', fontWeight: 400 }}>Forgot password?</Link>
                            </p>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Login;
