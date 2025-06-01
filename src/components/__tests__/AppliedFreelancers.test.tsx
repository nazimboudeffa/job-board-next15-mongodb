import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppliedFreelancers from '../AppliedFreelancers'; // Adjust path as necessary

// Mock applicant data
const mockApplicantData = [
  { id: 'app1', name: 'Alice Wonderland', jobTitle: 'Software Engineer Backend', skills: ['Node.js', 'Python', 'AWS'], profileLink: '/profile/alice' },
  { id: 'app2', name: 'Bob The Builder', jobTitle: 'UX Designer', skills: ['Figma', 'Adobe XD'], profileLink: '/profile/bob' },
  { id: 'app3', name: 'Charlie Brown', jobTitle: 'Software Engineer Backend', skills: ['Java', 'Spring Boot'], profileLink: '/profile/charlie' },
];

// Mock console.error to avoid noise during error state tests
let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

describe('AppliedFreelancers Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('renders loading state correctly', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<AppliedFreelancers />);
    expect(screen.getByText('Loading applicants...')).toBeInTheDocument();
  });

  test('renders error state correctly', async () => {
    const errorMessage = 'Failed to fetch applicants';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    render(<AppliedFreelancers />);
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}. Failed to load applicants.`)).toBeInTheDocument();
    });
  });

  test('renders "No applicants" message when no data is provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    render(<AppliedFreelancers />);
    await waitFor(() => {
      expect(screen.getByText('No freelancers have applied to your jobs yet.')).toBeInTheDocument();
    });
  });

  test('renders a list of applicants grouped by job title', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApplicantData,
    });
    render(<AppliedFreelancers />);

    await waitFor(() => {
      // Check for job title group headings
      expect(screen.getByText((content, element) => content.startsWith('Software Engineer Backend') && element?.tagName.toLowerCase() === 'h4')).toBeInTheDocument();
      expect(screen.getByText((content, element) => content.startsWith('UX Designer') && element?.tagName.toLowerCase() === 'h4')).toBeInTheDocument();

      // Check for applicant names under correct job titles
      // Alice and Charlie under "Software Engineer Backend"
      const backendSection = screen.getByText((content, element) => content.startsWith('Software Engineer Backend')).closest('div');
      expect(backendSection).toHaveTextContent('Alice Wonderland');
      expect(backendSection).toHaveTextContent('Charlie Brown');

      // Bob under "UX Designer"
      const uxSection = screen.getByText((content, element) => content.startsWith('UX Designer')).closest('div');
      expect(uxSection).toHaveTextContent('Bob The Builder');

      // Check for skills (presence of some skill tags)
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Figma')).toBeInTheDocument();

      // Check for skill tag classes (optional, for one instance)
      const skillTag = screen.getByText('Node.js');
      expect(skillTag).toHaveClass('bg-sky-100', 'text-sky-700');

      // Check for "View Profile" links and their hrefs
      const profileLinks = screen.getAllByText('View Profile');
      expect(profileLinks.length).toBe(mockApplicantData.length);

      profileLinks.forEach(link => {
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass('bg-indigo-500', 'text-white'); // Check button-like styling
      });

      // Check href attributes
      expect(screen.getByRole('link', { name: /view profile/i, exact: false })).toBeInTheDocument(); // general check
      const aliceProfileLink = profileLinks.find(link => link.closest('li')?.textContent?.includes('Alice Wonderland'));
      expect(aliceProfileLink).toHaveAttribute('href', '/profile/alice');

      const bobProfileLink = profileLinks.find(link => link.closest('li')?.textContent?.includes('Bob The Builder'));
      expect(bobProfileLink).toHaveAttribute('href', '/profile/bob');
    });
  });

  test('handles unknown error correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce({}); // Simulate a non-Error object rejection
    render(<AppliedFreelancers />);

    await waitFor(() => {
      expect(screen.getByText('Error: An unknown error occurred while fetching applicants.. Failed to load applicants.')).toBeInTheDocument();
    });
  });
});
