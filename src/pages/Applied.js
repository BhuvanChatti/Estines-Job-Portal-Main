import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Applied = () => {
    const Options = ['Pending', 'Reject', 'Interview', 'Selected'];
    const [search, setSearch] = useState('');
    const [sortM, setSM] = useState(false);
    const [sort, setsort] = useState('latest');
    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const [numOfPage, setNumOfPage] = useState(0);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://estines-job-portal.onrender.com/api/v1/job/get-Wmy-jobs', {
                    params: {
                        sort: sort,
                        page,
                        limit: 10,
                        status: 'all',
                        workType: 'all',
                        search: search,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response);

                setAllJobs(response.data.jobs);
                setJobs(response.data.jobs);
                setTotalJobs(response.data.totalJobs);
                setNumOfPage(response.data.numOfPage);
            } catch (err) {
                setError('Error fetching jobs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [search, page, sort]);

    const StatusDropdown = ({ currentStatus, jobId }) => {
        const [open, setOpen] = useState(false);
        const [selectedStatus, setSelectedStatus] = useState(currentStatus);

        const handlestatus = async (s) => {
            //     return (<div className="bg-yellow-600 text-black px-3 py-1 text-sm rounded-full flex">{s} 🔽</div>);
            // } {
            setSelectedStatus(s);
            setOpen(false);
            try {
                console.log(jobId);
                await axios.put(`https://estines-job-portal.onrender.com/api/v1/job/changeapply/${jobId}`, {
                    status: s,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } catch (error) {
                console.error('Error updating status', error);
            }
        };

        return (
            <div className="relative inline-block text-left">
                <button onClick={() => setOpen(prev => !prev)}
                    className={`${selectedStatus === "Pending" ? "bg-yellow-600" : selectedStatus === "Interview" ? "bg-green-400" : selectedStatus === "Selected" ? "bg-green-600" : selectedStatus === "Reject" ? "bg-red-600" : "bg-gray-600"} text-black px-3 py-1 text-sm rounded-full flex items-center`}>
                    {selectedStatus} 🔽
                </button>
                {open && (
                    <div className="absolute z-10 right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        {Options.map((status) => (
                            <button key={status} onClick={() => handlestatus(status)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                {status}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handlesort = (s) => {
        setsort(s);
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">Job Applicants</h1>

            <div className="w-full max-w-2xl mb-6 flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Search by position or company"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => setSM(prev => !prev)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700">
                    Sort
                </button>
                {sortM && (<div className="origin-top-right absolute right-10 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1 text-sm text-gray-700">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handlesort('latest')}>Latest</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handlesort('oldest')}>Oldest</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handlesort('a-z')}>a-z</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handlesort('z-a')}>z-a</button>
                    </div>
                </div>)}
            </div>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 rounded w-full max-w-2xl text-center mb-4">
                    {error}
                </p>
            )}

            {loading && <p className="text-gray-600 mb-4">Loading...</p>}

            <div className="w-full max-w-2xl max-h-[450px] overflow-y-auto">
                {jobs.length > 0 ? (
                    jobs.map((job) => (

                        <div key={job._id} className="bg-blue-100 border border-blue-300 text-blue-900 rounded-xl shadow-md p-4 mb-4 hover:bg-blue-200 transition-colors">
                            <div className='flex justify-between'>
                                <h3 className="text-xl font-semibold mb-1">{job.JobId.position}</h3>
                                <div>
                                    <StatusDropdown currentStatus={job.status} jobId={job._id} />
                                </div>
                            </div>
                            <p className="text-base">Applied By: {job.ApplicantID.name} {job.ApplicantID.lastName}</p>
                            <p className="text-base">Email: {job.ApplicantID.email}</p>
                            <p className="text-base">Date: {job.createdAt}</p>
                        </div>
                    ))
                ) :
                    (<p className="bg-blue-50 text-blue-700 px-4 py-2 rounded w-full max-w-2xl text-center">No jobs found</p>)}
            </div>

            <div className="mt-6 flex items-center gap-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full shadow disabled:bg-gray-400"
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium">
                    Page {page} of {numOfPage}
                </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === numOfPage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full shadow disabled:bg-gray-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Applied;