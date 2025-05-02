import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
    const [search, setSearch] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const [numOfPage, setNumOfPage] = useState(0);

    useEffect(() => {
        // Fetch jobs when the component mounts or search changes
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://estines-job-portal.onrender.com/api/v1/job/get-jobs', {
                    params: {
                        search,
                        sort: 'latest',
                        page,
                        limit: 10,
                        status: 'all', // You can change this to filter jobs based on status
                        workType: 'all', // You can change this as well to filter jobs based on work type
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store your JWT in localStorage
                    }
                });

                setJobs(response.data.jobs);
                setTotalJobs(response.data.totalJobs);
                setNumOfPage(response.data.numOfPage);
            } catch (err) {
                setError('Error fetching jobs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (search) {
            fetchJobs();
        }
    }, [search, page]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="search-page">
            <h1>Job Search</h1>

            {/* Search input */}
            <input
                type="text"
                placeholder="Search by position or company"
                value={search}
                onChange={handleSearchChange}
                className="search-input"
            />

            {/* Error message */}
            {error && <p className="error-message">{error}</p>}

            {/* Loading indicator */}
            {loading && <p>Loading...</p>}

            {/* Jobs list */}
            <div className="jobs-list">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="job-item">
                            <h3>{job.position}</h3>
                            <p>Company: {job.company}</p>
                            <p>Status: {job.status}</p>
                            <p>Work Type: {job.workType}</p>
                        </div>
                    ))
                ) : (
                    <p>No jobs found</p>
                )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {numOfPage}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === numOfPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Search;