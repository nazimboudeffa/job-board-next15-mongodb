import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyJobListings from '../MyJobListings'; // Adjust path as necessary

// Mock job data
const mockJobsData = [
  { id: '1', title: 'Software Engineer Backend', status: 'open' as const, applicantsCount: 15 },
  { id: '2', title: 'Product Manager', status: 'closed' as const, applicantsCount: 30 },
  { id: '3', title: 'UX Designer', status: 'draft' as const, applicantsCount: 0 },
];

// Mock console.error to avoid noise during error state tests
let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

describe('MyJobListings Component', () => {
  beforeEach(() => {
    // Reset fetch mock for each test
    global.fetch = jest.fn();
  });

  test('renders loading state correctly', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Promise that never resolves
    );
    render(<MyJobListings />);
    expect(screen.getByText('Loading jobs...')).toBeInTheDocument();
  });

  test('renders error state correctly', async () => {
    const errorMessage = 'Simulated API Error';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    render(<MyJobListings />);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}. Failed to load jobs.`)).toBeInTheDocument();
    });
  });

  test('renders "No jobs posted" message when no jobs are provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [], // Empty array of jobs
    });
    render(<MyJobListings />);

    await waitFor(() => {
      expect(screen.getByText("You haven't posted any jobs yet.")).toBeInTheDocument();
    });
  });

  test('renders a list of jobs correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobsData,
    });
    render(<MyJobListings />);

    await waitFor(() => {
      // Check for job titles
      expect(screen.getByText('Software Engineer Backend')).toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
      expect(screen.getByText('UX Designer')).toBeInTheDocument();

      // Check for statuses (text content of the badge)
      expect(screen.getByText('open')).toBeInTheDocument();
      expect(screen.getByText('closed')).toBeInTheDocument();
      expect(screen.getByText('draft')).toBeInTheDocument();

      // Check for applicant counts
      expect(screen.getByText('Applicants:')).toBeInTheDocument(); // This text is part of multiple elements
      expect(screen.getAllByText(/Applicants:/).length).toBeGreaterThanOrEqual(mockJobsData.length / 2); // Rough check
      mockJobsData.forEach(job => {
        expect(screen.getByText(job.applicantsCount.toString())).toBeInTheDocument();
      });

      // Optional: Check for badge classes if important and stable
      const openStatusBadge = screen.getByText('open');
      expect(openStatusBadge).toHaveClass('bg-green-100', 'text-green-700');

      const closedStatusBadge = screen.getByText('closed');
      expect(closedStatusBadge).toHaveClass('bg-red-100', 'text-red-700');

      const draftStatusBadge = screen.getByText('draft');
      expect(draftStatusBadge).toHaveClass('bg-yellow-100', 'text-yellow-700');
    });
  });

  test('handles unknown error correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce({}); // Simulate a non-Error object rejection
    render(<MyJobListings />);

    await waitFor(() => {
      expect(screen.getByText('Error: An unknown error occurred.. Failed to load jobs.')).toBeInTheDocument();
    });
  });
});
