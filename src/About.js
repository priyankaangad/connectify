import React from "react";
import "./About.css"; // Optional: Add styling for the About page

const About = () => {
  return (
    <div className="about-page">
      <header className="header">
        <div className="container">
          <h1>About Connectify</h1>
        </div>
      </header>
      <section className="about-content">
        <div className="container">
          <h2>Our Mission</h2>
            <p>
            At Connectify, we strive to be more than just a job platform—we aspire to be <br />
            a bridge that connects ambitious job seekers with forward-thinking employers. <br />
            Our mission is to create a space where meaningful professional connections can <br />
            flourish, enabling individuals to find roles that align with their skills, passions, <br />
            and career goals.  
            </p>
            <p>
            Through personalized recommendations, vast job opportunities, and a seamless <br />
            user experience, we empower our users to take charge of their professional <br />
            journeys. Whether you're an experienced professional seeking new challenges <br />
            or a fresh graduate ready to begin your career, Connectify provides the tools <br />
            and resources to help you reach your dream opportunities and achieve growth.
            </p>


          <h2>What We Offer</h2>
          <ul>
          <p className="centered"> Connectify provides a comprehensive platform that bridges the gap between job seekers and recruiters. Job seekers can effortlessly search thousands of job listings using keywords and location filters, while also benefiting from tailored recommendations that match their skills and preferences. With our secure and user-friendly resume upload feature, candidates can easily store their resumes on AWS S3 and access them anytime for applications. For recruiters, Connectify simplifies the hiring process by offering a dedicated interface to create and manage job postings efficiently. To ensure a seamless user experience, we provide a robust forget password functionality with secure email-based recovery. Our platform is designed to deliver real-time job listings, making the hiring process faster and more effective for everyone involved.</p>
          </ul>
        </div>
      </section>
      <br></br>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Connectify. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
