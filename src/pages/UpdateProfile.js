import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';

const API = process.env.REACT_APP_API_URL || 'https://estines-job-portal.onrender.com/api/v1';

const UpdateProfile = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setLocation(user.location || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !lastName || !email || !location) {
            return toast.error('Please fill in all fields');
        }
        try {
            setSaving(true);
            const { data } = await axios.put(
                `${API}/user/update-user`,
                { name, lastName, email, location },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            localStorage.setItem('token', data.token);
            dispatch(setUser(data.user));
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Update Profile</h1>
                    <p className="text-sm text-gray-500 mb-6">Edit your account details</p>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white border border-gray-200 rounded-md p-6 space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="City, Country"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProfile;
