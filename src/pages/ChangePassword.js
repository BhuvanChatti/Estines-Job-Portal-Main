import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import OtpVerify from '../components/shared/OtpVerify';

const API = process.env.REACT_APP_API_URL || 'https://estines-job-portal.onrender.com/api/v1';

const ChangePassword = () => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [tab, setTab] = useState('current'); // 'current' | 'otp'
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleCurrentPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
        setSaving(true);
        try {
            await axios.put(
                `${API}/user/change-password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Change Password</h1>
                    <p className="text-sm text-gray-500 mb-6">Update your account password</p>

                    <div className="bg-white border border-gray-200 rounded-md">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setTab('current')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'current' ? 'text-gray-900 border-b-2 border-gray-900 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Current Password
                            </button>
                            <button
                                onClick={() => setTab('otp')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'otp' ? 'text-gray-900 border-b-2 border-gray-900 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Use OTP
                            </button>
                        </div>

                        <div className="p-6">
                            {tab === 'current' && (
                                <form onSubmit={handleCurrentPassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPw ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 pr-14"
                                                minLength={6}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPw(p => !p)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                                            >
                                                {showPw ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            type={showPw ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                                    >
                                        {saving ? 'Saving…' : 'Change Password'}
                                    </button>
                                </form>
                            )}

                            {tab === 'otp' && (
                                <OtpVerify
                                    prefillEmail={user?.email || ''}
                                    onSuccess={() => navigate('/dashboard')}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChangePassword;
