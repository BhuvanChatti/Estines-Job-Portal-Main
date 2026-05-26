import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';

const Jobs = () => {
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
                const response = await axios.get('https://estines-job-portal.onrender.com/api/v1/job/get-jobs', {
                    params: { sort, page, limit: 10, status: 'all', workType: 'all', search },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setJobs(response.data.jobs);
                setNumOfPage(response.data.numOfPage);
            } catch (err) {
                setError('Error fetching jobs. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [search, page, sort]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleApply = async (JobID) => {
        try {
            await axios.post('https://estines-job-portal.onrender.com/api/v1/job/apply', { job: JobID }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Applied successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to apply. Please try again.');
        }
    };

    const sortLabels = { latest: 'Latest', oldest: 'Oldest', 'a-z': 'A – Z', 'z-a': 'Z – A' };

    return (
        <Layout defaultCollapsed={true}>
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Browse Jobs</h1>
                <p className="text-sm text-gray-500 mb-6">Find your next opportunity</p>

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
                            <div key={i} className="h-20 bg-gray-200 rounded-md animate-pulse" />
                        ))}
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between hover:border-gray-400 transition-colors">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">{job.position}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{job.company} · {job.workType} · {job.workLocation}</p>
                                </div>
                                <button
                                    onClick={() => handleApply(job._id)}
                                    className="ml-4 shrink-0 px-4 py-1.5 text-xs font-medium border border-gray-900 text-gray-900 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 py-12">No jobs found.</p>
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
        </Layout>
    );
};

export default Jobs;
