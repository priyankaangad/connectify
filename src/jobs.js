import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './jobs.css'

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('http://localhost:3000/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleAddJob = () => {
    // Navigate to the "Add New Job" page
    navigate('/newjob');
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
        method: 'DELETE', // DELETE request
      });

      if (response.ok) {
        // Remove the job from the state after deletion
        setJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== jobId));
      } else {
        console.error('Failed to delete the job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return <div>No jobs available at the moment.</div>;
  }

  return (
    <div className="container">
        <button className="create-job-button" onClick={handleAddJob}>
        Add New Job
      </button>
      <h1>Job Listings</h1>
      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.job_id} className="job-card">
            <div className="job-title">{job.job_title}</div>
            <div className="company-name">{job.company_name}</div>
            <div className="job-description">
              {job.job_description || 'No description available'}
            </div>
            <button
              className="apply-button"
              onClick={() => handleDeleteJob(job.job_id)}
            >
              Delete Job
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;