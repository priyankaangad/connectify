import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleEmailCheck = async (e) => {
    e.preventDefault();

    // Send email to the backend for verification
    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage(
          data.message || "Email verified. Please set your new password."
        );
        setIsEmailVerified(true);
        setIsError(false);
      } else {
        setMessage(data.message || "Email not found.");
        setIsEmailVerified(false);
        setIsError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Send new password to backend for resetting
    try {
      const response = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage(data.message || "Password updated successfully!");
        setIsError(false);

        // Redirect to login page after a delay
        setTimeout(() => {
          window.location.href = "/login"; // Adjust the route to your login page
        }, 1500);
      } else {
        setMessage(data.message || "Failed to update password.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="forgotPasswordPage">
      <div className="parent">
        <h2 className="noMargin textAlignCenter">Forgot Password</h2>

        {/* Email Verification Form */}
        {!isEmailVerified && (
          <form id="forgotPasswordForm" onSubmit={handleEmailCheck}>
            <p className="textAlignCenter">
              Enter your registered email to reset your password.
            </p>
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" id="checkEmailButton">
              Check Email
            </button>
          </form>
        )}

        {/* Password Reset Form */}
        {isEmailVerified && (
          <form id="resetPasswordForm" onSubmit={handlePasswordReset}>
            <h3 className="textAlignCenter">Set a New Password</h3>
            <input
              type="password"
              id="newPassword"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">Update Password</button>
          </form>
        )}

        <p>
          <Link to="/login">Back to Login</Link>
        </p>

        {/* Status Message */}
        {message && (
          <div
            id="statusMessage"
            style={{
              display: "block",
              marginTop: "20px",
              color: isError ? "red" : "green",
            }}
          >
            <p className="textAlignCenter">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;
