import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [graduationStartDate, setGraduationStartDate] = useState("");
  const [graduationEndDate, setGraduationEndDate] = useState("");
  const [experience, setExperience] = useState([
    { companyName: "", role: "", startDate: "", endDate: "" },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data for the request
    const signupData = {
      name,
      email,
      password,
      skills: skills.split(","),
      educationLevel,
      graduationDates: {
        start: graduationStartDate,
        end: graduationEndDate,
      },
      experience,
    };

    try {
      // Simulate API request (replace this with your actual backend API call)
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sign-up successful! Please log in.");
        // You can redirect the user after successful signup
        window.location.href = "/login";
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signUp textAlignCenter">
      <h2>Create an Account</h2>
      <form id="signupForm" onSubmit={handleSubmit}>
        {/* Basic User Details */}
        <input
          type="text"
          id="name"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          id="skills"
          placeholder="Skills (comma-separated)"
          required
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        {/* Graduation Details */}
        <h3>Graduation Details</h3>
        <label htmlFor="educationLevel">Select Education Level:</label>
        <select
          id="educationLevel"
          className="formInput"
          required
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
        >
          <option value="" disabled selected>
            Select your education level
          </option>
          <option value="High School">High School</option>
          <option value="Bachelor's Degree">Bachelor's Degree</option>
          <option value="Master's Degree">Master's Degree</option>
          <option value="PhD">PhD</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <label>Start Date:</label>
        <input
          type="date"
          id="graduationStartDate"
          required
          value={graduationStartDate}
          onChange={(e) => setGraduationStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          id="graduationEndDate"
          required
          value={graduationEndDate}
          onChange={(e) => setGraduationEndDate(e.target.value)}
        />

        {/* Work Experience */}
        <h3>Work Experience</h3>
        <div id="experienceContainer">
          <div className="experience">
            <input
              type="text"
              placeholder="Company Name"
              className="companyName"
              value={experience[0].companyName}
              onChange={(e) =>
                setExperience([
                  { ...experience[0], companyName: e.target.value },
                ])
              }
            />
            <input
              type="text"
              placeholder="Role"
              className="role"
              value={experience[0].role}
              onChange={(e) =>
                setExperience([{ ...experience[0], role: e.target.value }])
              }
            />
            <label>Start Date:</label>
            <input
              type="date"
              className="expStartDate"
              value={experience[0].startDate}
              onChange={(e) =>
                setExperience([{ ...experience[0], startDate: e.target.value }])
              }
            />
            <label>End Date:</label>
            <input
              type="date"
              className="expEndDate"
              value={experience[0].endDate}
              onChange={(e) =>
                setExperience([{ ...experience[0], endDate: e.target.value }])
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
      <p id="message" className="message"></p>
    </div>
  );
}

export default Signup;
