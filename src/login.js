import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = (e) => {
    e.preventDefault(); 
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          email: email,
          password: password
      })
  })
      .then(response => {
          console.log("Response Status:", response.status);  // Debug log for status
          if (!response.ok) {
              throw new Error('Failed to login: ' + response.statusText);  // Throw error for non-OK responses
          }
          return response.json();  // Parse the JSON response
      })
      .then(data => {
          console.log("Login Response Data:", data);  // Debug log for the response data
          if (data.token) {
              // On success, store the token in localStorage
              alert(data.message || 'Login successful!');
              localStorage.setItem("authToken", data.token);
              setTimeout(() => {
                  window.location.href = '/landingpage';  // Redirect to the dashboard page
              }, 1500);  // 1.5 seconds delay
          } else {
              alert('Invalid email or password');
          }
      })
      .catch(error => {
          console.error('Error:', error);  // Log any errors in the network request
          alert('An error occurred: ' + error.message);  // Show error alert
      });
  }

  return (
    <div class="loginPageImg">
      <div class="parent">
        <h2 class="noMargin textAlignCenter">Login to Connectify</h2>
        <form id="loginForm" onSubmit={handleLoginClick}>
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
          <button type="submit">Login</button>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p>
            <Link to="/forgetpassword">Forgot Password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
