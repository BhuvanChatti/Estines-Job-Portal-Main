import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';

const API = process.env.REACT_APP_API_URL || 'https://estines-job-portal.onrender.com/api/v1';

const WORK_TYPES = ['Full-Time', 'Part-Time', 'Internship', 'Contract'];

const PostJob = () => {
    const navigate = useNavigate();
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [workType, setWorkType] = useState('Full-Time');
    const [workLocation, setWorkLocation] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState([]);
    const [reqInput, setReqInput] = useState('');
    const [saving, setSaving] = useState(false);

    const addRequirement = () => {
        const trimmed = reqInput.trim();
        if (trimmed && !requirements.includes(trimmed)) {
            setRequirements(prev => [...prev, trimmed]);
        }
        setReqInput('');
    };

    const handleReqKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addRequirement();
        }
    };

    const removeRequirement = (r) => setRequirements(prev => prev.filter(x => x !== r));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!company || !position || !workLocation) return toast.error('Please fill all required fields');
        if (requirements.length === 0) return toast.error('Add at least one requirement');
        try {
            setSaving(true);
            await axios.post(`${API}/job/create-job`, {
                company, position, workType, workLocation, description, requirements
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Job posted successfully');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post job');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Post a Job</h1>
                    <p className="text-sm text-gray-500 mb-6">Fill in the details to publish a new listing</p>

                    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                    placeholder="e.g. Estines Inc."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={position}
                                    onChange={e => setPosition(e.target.value)}
                                    placeholder="e.g. Frontend Engineer"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                                <select
                                    value={workType}
                                    onChange={e => setWorkType(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                                >
                                    {WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={workLocation}
                                    onChange={e => setWorkLocation(e.target.value)}
                                    placeholder="e.g. Hyderabad"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Describe the role, responsibilities, and team…"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Requirements <span className="text-red-500">*</span>
                                <span className="text-gray-400 font-normal ml-1">(press Enter to add)</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={reqInput}
                                    onChange={e => setReqInput(e.target.value)}
                                    onKeyDown={handleReqKeyDown}
                                    placeholder="e.g. 3+ years React experience"
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={addRequirement}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Add
                                </button>
                            </div>
                            {requirements.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {requirements.map(r => (
                                        <span
                                            key={r}
                                            className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                        >
                                            {r}
                                            <button
                                                type="button"
                                                onClick={() => removeRequirement(r)}
                                                className="text-gray-400 hover:text-gray-700 leading-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Posting…' : 'Post Job'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default PostJob;
