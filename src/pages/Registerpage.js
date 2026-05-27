import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from './../redux/features/alertSlice';
import Spinner from '../components/shared/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './R-L.css';

const API = process.env.REACT_APP_API_URL || 'https://estines-job-portal.onrender.com/api/v1';

const PasswordField = ({ label, value, onChange }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    type={show ? "text" : "password"}
                    className="form-control"
                    value={value}
                    onChange={onChange}
                    style={{ paddingRight: '44px' }}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShow(p => !p)}
                    style={{
                        position: 'absolute', right: '10px', top: '50%',
                        transform: 'translateY(-50%)', background: 'none',
                        border: 'none', cursor: 'pointer', color: '#6b7280',
                        fontSize: '0.8rem', padding: '0'
                    }}
                >
                    {show ? 'Hide' : 'Show'}
                </button>
            </div>
        </div>
    );
};

const Register = () => {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [location, setLocation] = useState("");
    const [userT, setUserT] = useState("Applicant");
    const { loading } = useSelector(state => state.alerts);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !lastName || !email || !password) {
            return toast.error('Please fill in all required fields');
        }
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        try {
            dispatch(showLoading());
            const { data } = await axios.post(`${API}/auth/register`, {
                name, lastName, email, password, location, type: userT
            });
            dispatch(hideLoading());
            if (data.success) {
                toast.success('Registered successfully');
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <>
            {loading ? <Spinner /> : (
                <div className='form-container'>
                    <form className="card p-2" onSubmit={handleSubmit}>
                        <img src="/assets/images/logo-black.png" alt="Estines" />

                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <PasswordField label="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <PasswordField label="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input type="text" className="form-control" value={location} onChange={e => setLocation(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">I am a</label>
                            <div className="d-flex gap-3 mt-1">
                                {['Applicant', 'Recruiter'].map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="radio"
                                            name="userType"
                                            value={type}
                                            checked={userT === type}
                                            onChange={() => setUserT(type)}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex flex-column align-items-center gap-2 mt-1">
                            <p className="mb-0" style={{ fontSize: '0.875rem' }}>
                                Already registered?{' '}
                                <Link to="/login" style={{ color: '#2563eb', fontWeight: 500 }}>Login</Link>
                            </p>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Register;
