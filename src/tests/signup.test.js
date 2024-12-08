import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "../pages/signup.js"; // Adjust the import path to your `Signup` component
import "@testing-library/jest-dom"; // For extended matchers

// Mock the `fetch` function globally
global.fetch = jest.fn();

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("renders the signup form correctly", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Check for form elements
    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Skills \(comma-separated\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Graduation Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Work Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it("handles input changes correctly", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Input values
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Skills/i), {
      target: { value: "React,Node.js" },
    });

    // Check if the inputs have the correct values
    expect(screen.getByPlaceholderText(/Full Name/i).value).toBe("John Doe");
    expect(screen.getByPlaceholderText(/Email/i).value).toBe(
      "john@example.com"
    );
    expect(screen.getByPlaceholderText(/Password/i).value).toBe("password123");
    expect(screen.getByPlaceholderText(/Skills/i).value).toBe(
      "React,Node.js"
    );
  });
});
