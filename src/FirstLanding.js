import React from 'react';
import { Link } from 'react-router-dom';
import './FirstLanding.css'; // Import the CSS file
import "./About.css";

const FirstLanding = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <h1 className="logo">Connectify</h1>
          <nav className="nav">
          <Link to="/login">
            Login
          </Link>
          <Link to="/signup">
            Register
          </Link>
          <Link to="/about">About</Link>
          <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h2>Your Dream Job Awaits</h2>
          <p>Explore thousands of job opportunities that fit your skills and passions.</p>
          <Link to="/login">
            <button className="cta-button">Login to Get Started</button>
          </Link>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h3>Why Choose Connectify?</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <h4>Vast Opportunities</h4>
              <p>Connect with top companies and exciting startups.</p>
            </div>
            <div className="feature-item">
              <h4>Tailored Matches</h4>
              <p>Personalized recommendations based on your profile.</p>
            </div>
            <div className="feature-item">
              <h4>Seamless Experience</h4>
              <p>Easy-to-use platform with intuitive features.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className="jobs">
        <div className="container">
          <h3>Explore Jobs</h3>
          <ul className="job-list">
            <li className="job-item">Frontend Developer - Google</li>
            <li className="job-item">Backend Engineer - Amazon</li>
            <li className="job-item">Data Scientist - Meta</li>
            <li className="job-item">UI/UX Designer - Microsoft</li>
          </ul>
          <button className="cta-button">View All Jobs</button>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Connectify. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FirstLanding;
