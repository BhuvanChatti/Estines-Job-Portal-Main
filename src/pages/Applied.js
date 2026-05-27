import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'https://estines-job-portal.onrender.com/api/v1';

const statusStyle = {
    Pending:   'bg-amber-50 text-amber-700 border-amber-200',
    Interview: 'bg-blue-50 text-blue-700 border-blue-200',
    Selected:  'bg-green-50 text-green-700 border-green-200',
    Reject:    'bg-red-50 text-red-700 border-red-200',
};

const statusLabel = {
    Pending:   'Pending',
    Interview: 'Interview',
    Selected:  'Selected',
    Reject:    'Rejected',
};

const NEXT_OPTIONS = {
    Pending:   ['Interview', 'Reject'],
    Interview: ['Selected', 'Reject'],
    Selected:  [],
    Reject:    [],
};

const StatusDropdown = ({ currentStatus, jobId, onUpdated }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(currentStatus);
    const ref = useRef(null);

    const options = NEXT_OPTIONS[selected] || [];
    const isFinal = options.length === 0;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = async (s) => {
        setOpen(false);
        try {
            await axios.put(`${API}/job/changeapply/${jobId}`, { status: s }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSelected(s);
            if (onUpdated) onUpdated(jobId, s);
            toast.success(`Status updated to ${s}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (isFinal) {
        return (
            <span className={`px-3 py-1 text-xs font-medium border rounded-full ${statusStyle[selected] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {statusLabel[selected] || selected}
            </span>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className={`px-3 py-1 text-xs font-medium border rounded-full flex items-center gap-1.5 ${statusStyle[selected] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
                {statusLabel[selected] || selected}
                <span className="opacity-60">{open ? '▲' : '▼'}</span>
            </button>
            {open && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    {options.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSelect(s)}
                            className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-gray-600"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Applied = () => {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('latest');
    const [sortOpen, setSortOpen] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [numOfPage, setNumOfPage] = useState(0);
    const sortRef = useRef(null);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API}/job/get-Wmy-jobs`, {
                    params: { sort, page, limit: 10, status: 'all', workType: 'all', search },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setJobs(response.data.jobs);
                setNumOfPage(response.data.numOfPage);
            } catch (err) {
                setError('Error fetching applicants. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [search, page, sort]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusUpdated = (jobId, newStatus) => {
        setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
    };

    const sortLabels = { latest: 'Latest', oldest: 'Oldest', 'a-z': 'A – Z', 'z-a': 'Z – A' };

    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="bg-gray-50 px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Applicants</h1>
                <p className="text-sm text-gray-500 mb-6">Manage candidates who applied to your postings</p>

                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search by position or company…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <div className="relative" ref={sortRef}>
                        <button
                            onClick={() => setSortOpen(prev => !prev)}
                            className="px-4 py-2 text-sm border border-gray-300 bg-white rounded-md hover:bg-gray-50 flex items-center gap-2"
                        >
                            {sortLabels[sort]}
                            <span className="text-gray-400">{sortOpen ? '▲' : '▼'}</span>
                        </button>
                        {sortOpen && (
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-md z-50">
                                {Object.entries(sortLabels).map(([val, label]) => (
                                    <button
                                        key={val}
                                        onClick={() => { setSort(val); setSortOpen(false); setPage(1); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sort === val ? 'font-medium text-gray-900' : 'text-gray-600'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded-md animate-pulse" />
                        ))}
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white border border-gray-200 rounded-md p-4 hover:border-gray-400 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">{job.JobId.position}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {job.ApplicantID.name} {job.ApplicantID.lastName}
                                            <span className="mx-1.5">·</span>
                                            {job.ApplicantID.email}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Applied {formatDate(job.createdAt)}</p>
                                    </div>
                                    <StatusDropdown
                                        currentStatus={job.status}
                                        jobId={job._id}
                                        onUpdated={handleStatusUpdated}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 py-12">No applicants yet.</p>
                )}

                {numOfPage > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">Page {page} of {numOfPage}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page === numOfPage}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applied;
