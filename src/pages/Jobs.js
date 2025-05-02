import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const My_Jobs = () => {
    const [search, setSearch] = useState('');
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
                const response = await axios.get('https://estines-job-portal.onrender.com/api/v1/job/get-jobs', {
                    params: {
                        sort: 'latest',
                        page,
                        limit: 10,
                        status: 'all',
                        workType: 'all',
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

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
    }, [page]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        if (search.trim() === '') {
            setJobs(allJobs);
        } else {
            const filteredJobs = allJobs.filter(
                (job) =>
                    job.position.toLowerCase().includes(search.toLowerCase()) ||
                    job.company.toLowerCase().includes(search.toLowerCase())
            );
            setJobs(filteredJobs);
        }
    }, [search, allJobs]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="d-flex flex-column align-items-center p-4">
            <h1 className="mb-3">Job Search</h1>

            {/* Search input */}
            <div className="mb-3 w-75">
                <input
                    type="text"
                    placeholder="Search by position or company"
                    value={search}
                    onChange={handleSearchChange}
                    className="form-control rounded-pill"
                />
            </div>

            {/* Error message */}
            {error && <p className="alert alert-danger w-75 text-center">{error}</p>}

            {/* Loading indicator */}
            {loading && <p>Loading...</p>}

            {/* Jobs list */}
            <div className="w-75">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="card shadow-sm rounded-sm mb-3 p-3">
                            <h3>{job.position}</h3>
                            <p className="mb-1">Company: {job.company}</p>
                            <p className="mb-1">Status: {job.status}</p>
                            <p className="mb-0">Work Type: {job.workType}</p>
                        </div>
                    ))
                ) : (
                    <p className="alert alert-info w-75 text-center">No jobs found</p>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="btn btn-outline-primary rounded-pill me-2"
                >
                    Previous
                </button>
                <span>Page {page} of {numOfPage}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === numOfPage}
                    className="btn btn-outline-primary rounded-pill ms-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default My_Jobs;