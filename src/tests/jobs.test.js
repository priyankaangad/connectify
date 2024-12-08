import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Jobs from "../pages/jobs";
import "@testing-library/jest-dom"; // Import to extend Jest matchers

// Mock the `fetch` function globally
global.fetch = jest.fn();

describe("Jobs Component", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should display loading text initially", () => {
    render(
      <BrowserRouter>
        <Jobs />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading jobs.../i)).toBeInTheDocument();
  });

  it("should render job listings after fetching jobs", async () => {
    const mockJobs = [
      {
        job_id: 1,
        job_title: "Software Engineer",
        company_name: "Tech Corp",
        job_description: "Develop and maintain software applications.",
      },
      {
        job_id: 2,
        job_title: "Data Scientist",
        company_name: "Data Inc.",
        job_description: "Analyze data to extract insights.",
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs,
    });

    render(
      <BrowserRouter>
        <Jobs />
      </BrowserRouter>
    );

    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText("Job Listings")).toBeInTheDocument();
    });

    // Check if job details are rendered
    mockJobs.forEach((job) => {
      expect(screen.getByText(job.job_title)).toBeInTheDocument();
      expect(screen.getByText(job.company_name)).toBeInTheDocument();
      expect(screen.getByText(job.job_description)).toBeInTheDocument();
    });
  });
});
