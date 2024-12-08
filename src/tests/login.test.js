import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/login"; // Adjust the path as needed

global.fetch = jest.fn();

describe("Login Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });


  it("handles login with valid credentials", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "mock-token", message: "Login successful!" }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i })); // Specifically target the button

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com", password: "password123" }),
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem("authToken")).toBe("mock-token");
    });
  });

  it("handles login with invalid credentials", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "invalid@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i })); // Specifically target the button

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "invalid@example.com", password: "wrongpassword" }),
      });
    });
  });
});
