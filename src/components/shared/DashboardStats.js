import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API = process.env.REACT_APP_API_URL || 'https://estines-job-portal.onrender.com/api/v1';

const StatCard = ({ label, value, color, loading }) => (
    <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderTop: `3px solid ${color}`,
        borderRadius: '8px',
        padding: '20px 24px',
        flex: 1,
        minWidth: 0,
    }}>
        {loading ? (
            <div style={{ height: '32px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '8px' }} />
        ) : (
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{value}</div>
        )}
        <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '6px', fontWeight: 500 }}>{label}</div>
    </div>
);

const countByStatus = (jobs) =>
    jobs.reduce((acc, j) => {
        const s = j.status || 'Pending';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

const DashboardStats = ({ userT }) => {
    const { user } = useSelector(state => state.auth);
    const [cards, setCards] = useState(null);
    const [loading, setLoading] = useState(true);

    const fullName = user ? `${user.name || ''} ${user.lastName || ''}`.trim() : '';
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                if (userT === 'Recruiter') {
                    // Use the same endpoint as Applied.js — it already works
                    const { data } = await axios.get(`${API}/job/get-Wmy-jobs`, {
                        params: { sort: 'latest', page: 1, limit: 500, status: 'all', workType: 'all' },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const jobs = data.jobs || [];
                    const total = data.totalJobs ?? jobs.length;
                    const counts = countByStatus(jobs);
                    setCards([
                        { label: 'Total Applications', value: total, color: '#374151' },
                        { label: 'Pending', value: counts.Pending || 0, color: '#d97706' },
                        { label: 'Interview', value: counts.Interview || 0, color: '#2563eb' },
                        { label: 'Selected', value: counts.Selected || 0, color: '#16a34a' },
                    ]);
                } else {
                    // Applicant — use get-my-jobs (same as MyJobs.js)
                    const { data } = await axios.get(`${API}/job/get-my-jobs`, {
                        params: { sort: 'latest', page: 1, limit: 500, status: 'all', workType: 'all' },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const jobs = data.jobs || [];
                    const total = data.totalJobs ?? jobs.length;

                    // get-my-jobs returns ApplJobs populated with JobId — status is on the ApplJob doc
                    const counts = countByStatus(jobs);
                    setCards([
                        { label: 'Total Applied', value: total, color: '#374151' },
                        { label: 'Pending', value: counts.Pending || 0, color: '#d97706' },
                        { label: 'Interview', value: counts.Interview || 0, color: '#2563eb' },
                        { label: 'Selected', value: counts.Selected || 0, color: '#16a34a' },
                    ]);
                }
            } catch (_) {
                setCards(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userT]);

    return (
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '28px 32px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Welcome back{fullName ? `, ${fullName}` : ''}
                </h1>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                    {userT === 'Recruiter'
                        ? 'Here\'s what\'s happening with your listings.'
                        : 'Track where your applications stand.'}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {(cards || Array(4).fill(null)).map((card, i) => (
                    <StatCard
                        key={i}
                        label={card?.label || ''}
                        value={card?.value ?? '—'}
                        color={card?.color || '#e5e7eb'}
                        loading={loading}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardStats;
