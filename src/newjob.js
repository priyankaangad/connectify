import React, { useState } from 'react';
import './newjob.css'; // Ensure styles are imported correctly

const NewJob = () => {
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    job_description: '',
    job_type: '',
    salary: '',
    skills_required: '',
    application_deadline: '',
    contact_email: '',
    location: '',
  });

  const [message, setMessage] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    const errors = document.querySelectorAll('.error');
    errors.forEach((error) => {
      error.style.display = 'none';
    });

    let isValid = true;

    // Validate fields
    if (!formData.job_title) {
      document.getElementById('job_title_error').style.display = 'block';
      isValid = false;
    }
    if (!formData.company_name) {
      document.getElementById('company_name_error').style.display = 'block';
      isValid = false;
    }
    if (!formData.job_description) {
      document.getElementById('job_description_error').style.display = 'block';
      isValid = false;
    }
    if (!formData.job_type) {
      document.getElementById('job_type_error').style.display = 'block';
      isValid = false;
    }
    if (!formData.salary) {
      document.getElementById('salary_error').style.display = 'block';
      isValid = false;
    }
    if (!formData.application_deadline) {
      document.getElementById('application_deadline_error').style.display = 'block';
      isValid = false;
    }
    if (!formData.contact_email || !formData.contact_email.includes('@')) {
      document.getElementById('contact_email_error').style.display = 'block';
      isValid = false;
    }
    if (!formData.location) {
      document.getElementById('location_error').style.display = 'block';
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await fetch('http://localhost:3000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Job added successfully!');
        setFormData({
          job_title: '',
          company_name: '',
          job_description: '',
          job_type: '',
          salary: '',
          skills_required: '',
          application_deadline: '',
          contact_email: '',
          location: '',
        });
      } else {
        setMessage('Failed to add job. Please try again.');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      setMessage('An error occurred while adding the job.');
    }
  };

  return (
    <div className="new-job-container">
      <h1>Create New Job</h1>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="new-job-form">
        <div className="form-group">
          <label htmlFor="job_title">Job Title</label>
          <input
            type="text"
            id="job_title"
            name="job_title"
            placeholder="Enter job title"
            value={formData.job_title}
            onChange={handleChange}
            required
          />
          <div className="error" id="job_title_error">Job title is required</div>
        </div>

        <div className="form-group">
          <label htmlFor="company_name">Company Name</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            placeholder="Enter company name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
          <div className="error" id="company_name_error">Company name is required</div>
        </div>

        <div className="form-group">
          <label htmlFor="job_description">Job Description</label>
          <textarea
            id="job_description"
            name="job_description"
            rows="4"
            placeholder="Enter job description"
            value={formData.job_description}
            onChange={handleChange}
            required
          ></textarea>
          <div className="error" id="job_description_error">Job description is required</div>
        </div>

        <div className="form-group">
          <label htmlFor="job_type">Job Type</label>
          <select
            id="job_type"
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            required
          >
            <option value="">Select job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <div className="error" id="job_type_error">Please select job type</div>
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary (per month)</label>
          <input
            type="number"
            id="salary"
            name="salary"
            placeholder="Enter salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
          <div className="error" id="salary_error">Salary is required</div>
        </div>

        <div className="form-group">
          <label htmlFor="skills_required">Skills Required</label>
          <input
            type="text"
            id="skills_required"
            name="skills_required"
            placeholder="Enter skills required"
            value={formData.skills_required}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="application_deadline">Application Deadline</label>
          <input
            type="date"
            id="application_deadline"
            name="application_deadline"
            value={formData.application_deadline}
            onChange={handleChange}
            required
          />
          <div className="error" id="application_deadline_error">Application deadline is required</div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <div className="error" id="location_error">Location is required</div>
        </div>

        <div className="form-group">
          <label htmlFor="contact_email">Contact Email</label>
          <input
            type="email"
            id="contact_email"
            name="contact_email"
            placeholder="Enter contact email"
            value={formData.contact_email}
            onChange={handleChange}
            required
          />
          <div className="error" id="contact_email_error">Valid email is required</div>
        </div>

        <button type="submit" className="submit-button">Create Job</button>
      </form>
    </div>
  );
};

export default NewJob;