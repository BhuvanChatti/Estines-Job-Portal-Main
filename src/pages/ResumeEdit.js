import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';

const API = process.env.REACT_APP_API_URL || 'https://estines-job-portal.onrender.com/api/v1';

const Field = ({ label, value, onChange, multiline }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>
        {multiline ? (
            <textarea
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
            />
        ) : (
            <input
                type="text"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
        )}
    </div>
);

const TagEditor = ({ label, values, onChange }) => {
    const [input, setInput] = useState('');
    const add = () => {
        const t = input.trim();
        if (t && !values.includes(t)) onChange([...values, t]);
        setInput('');
    };
    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
                    placeholder="Type and press Enter"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <button type="button" onClick={add} className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
                {(values || []).map((v, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {v}
                        <button
                            type="button"
                            onClick={() => onChange(values.filter((_, j) => j !== i))}
                            className="text-gray-400 hover:text-gray-700"
                        >×</button>
                    </span>
                ))}
            </div>
        </div>
    );
};

const ResumeEdit = () => {
    const [data, setData] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const fileRef = useRef(null);

    useEffect(() => {
        axios.get(`${API}/resume/get`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(r => {
            setData(r.data.parsedResume || {});
            setResumeUrl(r.data.resumeUrl || '');
        }).catch(() => setData({})).finally(() => setLoadingInitial(false));
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') return toast.error('Only PDF files are supported');
        const formData = new FormData();
        formData.append('resume', file);
        setUploading(true);
        try {
            const { data: res } = await axios.post(`${API}/resume/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setData(res.parsedResume || {});
            setResumeUrl(res.resumeUrl || '');
            toast.success('Resume uploaded and parsed successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const update = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    const updateExperience = (i, key, val) => setData(prev => {
        const exp = [...(prev.experience || [])];
        exp[i] = { ...exp[i], [key]: val };
        return { ...prev, experience: exp };
    });

    const updateEducation = (i, key, val) => setData(prev => {
        const edu = [...(prev.education || [])];
        edu[i] = { ...edu[i], [key]: val };
        return { ...prev, education: edu };
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`${API}/resume/save`, { parsedResume: data }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Resume data saved');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loadingInitial) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-sm text-gray-500">Loading…</div>
                </div>
            </Layout>
        );
    }

    const exp = data?.experience || [];
    const edu = data?.education || [];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Upload section */}
                    <div className="bg-white border border-gray-200 rounded-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Resume</h1>
                                <p className="text-xs text-gray-500 mt-0.5">Upload a PDF — AI will extract your info automatically</p>
                            </div>
                            {resumeUrl && (
                                <a href={resumeUrl} target="_blank" rel="noreferrer"
                                    className="text-xs text-blue-600 hover:underline">
                                    View current PDF ↗
                                </a>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
                        >
                            {uploading ? 'Uploading & parsing…' : resumeUrl ? '↑ Replace resume PDF' : '↑ Upload resume PDF'}
                        </button>
                    </div>

                    {/* Basic info */}
                    <div className="bg-white border border-gray-200 rounded-md p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-gray-900">Basic Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Name" value={data?.name} onChange={v => update('name', v)} />
                            <Field label="Email" value={data?.email} onChange={v => update('email', v)} />
                            <Field label="Phone" value={data?.phone} onChange={v => update('phone', v)} />
                            <Field label="Location" value={data?.location} onChange={v => update('location', v)} />
                        </div>
                        <Field label="Summary" value={data?.summary} onChange={v => update('summary', v)} multiline />
                    </div>

                    {/* Skills */}
                    <div className="bg-white border border-gray-200 rounded-md p-6">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">Skills</h2>
                        <TagEditor label="" values={data?.skills || []} onChange={v => update('skills', v)} />
                    </div>

                    {/* Experience */}
                    <div className="bg-white border border-gray-200 rounded-md p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Experience</h2>
                            <button
                                type="button"
                                onClick={() => setData(prev => ({ ...prev, experience: [...(prev.experience || []), { title: '', company: '', duration: '', description: '' }] }))}
                                className="text-xs text-gray-500 hover:text-gray-800 border border-gray-300 px-3 py-1 rounded-md"
                            >+ Add</button>
                        </div>
                        {exp.map((e, i) => (
                            <div key={i} className="space-y-3 pt-4 border-t border-gray-100 first:border-0 first:pt-0">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400">#{i + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => setData(prev => ({ ...prev, experience: exp.filter((_, j) => j !== i) }))}
                                        className="text-xs text-red-400 hover:text-red-600"
                                    >Remove</button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Title" value={e.title} onChange={v => updateExperience(i, 'title', v)} />
                                    <Field label="Company" value={e.company} onChange={v => updateExperience(i, 'company', v)} />
                                </div>
                                <Field label="Duration" value={e.duration} onChange={v => updateExperience(i, 'duration', v)} />
                                <Field label="Description" value={e.description} onChange={v => updateExperience(i, 'description', v)} multiline />
                            </div>
                        ))}
                        {exp.length === 0 && <p className="text-xs text-gray-400">No experience added yet.</p>}
                    </div>

                    {/* Education */}
                    <div className="bg-white border border-gray-200 rounded-md p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Education</h2>
                            <button
                                type="button"
                                onClick={() => setData(prev => ({ ...prev, education: [...(prev.education || []), { degree: '', institution: '', year: '' }] }))}
                                className="text-xs text-gray-500 hover:text-gray-800 border border-gray-300 px-3 py-1 rounded-md"
                            >+ Add</button>
                        </div>
                        {edu.map((e, i) => (
                            <div key={i} className="space-y-3 pt-4 border-t border-gray-100 first:border-0 first:pt-0">
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setData(prev => ({ ...prev, education: edu.filter((_, j) => j !== i) }))}
                                        className="text-xs text-red-400 hover:text-red-600"
                                    >Remove</button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Degree" value={e.degree} onChange={v => updateEducation(i, 'degree', v)} />
                                    <Field label="Year" value={e.year} onChange={v => updateEducation(i, 'year', v)} />
                                </div>
                                <Field label="Institution" value={e.institution} onChange={v => updateEducation(i, 'institution', v)} />
                            </div>
                        ))}
                        {edu.length === 0 && <p className="text-xs text-gray-400">No education added yet.</p>}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ResumeEdit;
