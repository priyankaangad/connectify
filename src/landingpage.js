import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import company1 from "./assests/abid-shah-cxAV7aUesIQ-unsplash.jpg";
import company2 from "./assests/boliviainteligente-z7ICBEMUJfw-unsplash.jpg";
import company3 from "./assests/shutter-speed-RoqC4Bw5B8A-unsplash.jpg";
import "./landingpage.css";

function LandingPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobResults, setJobResults] = useState([]);
  const [error, setError] = useState("");

  // Fetch all jobs on initial page load
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/jobs/search"
        );
        setJobResults(response.data);
      } catch (err) {
        console.error("Error fetching all jobs:", err);
        setError("Unable to fetch job listings. Please try again later.");
      }
    };

    fetchAllJobs();
  }, []);

  // // AWS S3 Configuration
  // const S3_BUCKET = 'myresumebucketnewrahul';
  // const REGION = 'us-east-1';

  // AWS.config.update({
  //     accessKeyId: AWS_ACCESS_KEY, // Replace with your AWS Access Key ID
  //     secretAccessKey: AWS_ACCESS_SECRET // Replace with your AWS Secret Access Key
  // });

  // const s3 = new AWS.S3({
  //     params: { Bucket: S3_BUCKET },
  //     region: REGION,
  // });

  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    window.location.href = "/";
  };

  const handleUpload = () => {
    window.location.href = "/upload";
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.get(
        "http://localhost:3000/api/jobs/search",
        {
          params: { keyword, location },
        }
      );
      setJobResults(response.data);
    } catch (err) {
      console.error("Error searching for jobs:", err);
      setError("Unable to fetch job listings. Please try again later.");
    }
  };

  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="landing-header">
        <div className="logo">Connectify</div>
        <nav className="nav-menu">
          <div className="button-container">
            <Link to="/profile">
              <button className="signup-btn">Profile</button>
            </Link>
            <button className="signup-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </nav>
      </header>

      <nav className="navbar-main">
        <ul className="nav-list-main">
          {/* <li><a href="#">Find Jobs</a></li> */}
          <li>
            <a href="#">Salary Tools</a>
          </li>
          <li>
            <a href="#">Career Advice</a>
          </li>
          <li>
            <a href="#">Resume Help</a>
          </li>
          {/* <li><a href={handleLogoutClick}>Upload Resume</a></li> */}
          <li>
            {/* Corrected "Upload Resume" navigation */}
            <a onClick={handleUpload}>Upload Resume</a>
          </li>

          <li>
            <Link to="/jobs">Employers / Post Job</Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Next Job with Connectify</h1>
          <p>
            Explore thousands of job listings and discover your dream career
            today.
          </p>
          <form className="job-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Job title or keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* Job Results Section */}
      <section className="job-results">
        <h2>Search Results</h2>
        {error && <p className="error-message">{error}</p>}
        {jobResults.length > 0 ? (
          <div className="job-cards">
            {jobResults.map((job) => (
              <div key={job.id} className="job-card">
                <h3 className="job-title">{job.job_title}</h3>
                <p>
                  <strong>Company:</strong> {job.company_name}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Salary:</strong>{" "}
                  {job.salary ? `$${job.salary}` : "Not Specified"}
                </p>
                <p>{job.job_description}</p>
                {job.company_website && (
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-button"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          !error && <p>No jobs found. Try refining your search criteria.</p>
        )}
      </section>

      {/* Featured Companies Section */}
      <section id="companies" className="featured-companies">
        <h2>Featured Companies</h2>
        <div className="company-logos">
          <div className="company-logo">
            <img src={company1} alt="Company 1" className="company-logo img" />
            <img src={company2} alt="Company 2" className="company-logo img" />
            <img src={company3} alt="Company 3" className="company-logo img" />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer">
        <p>&copy; 2024 Connectify. All rights reserved.</p>
        <nav className="footer-nav">
          <ul>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms">Terms of Use</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

export default LandingPage;
