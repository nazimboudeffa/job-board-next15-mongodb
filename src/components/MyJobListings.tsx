"use client";

import React, { useState, useEffect } from 'react';

interface Job {
  id: string;
  title: string;
  status: 'open' | 'closed' | 'draft';
  applicantsCount: number;
}

const MyJobListings: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      // Fetch jobs posted by the current user
      const fetchUserJobs: () => Promise<Job[]> = async () => {
          const response = await fetch('/api/dashboard/jobs', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          });

          const data = await response.json();

          // Log the entire response for debugging
          console.log('API Response:', data);

          // Check if response is successful and has jobs
          if (!response.ok) {
              throw new Error(data.error ?? 'Failed to fetch jobs');
          }

          // Ensure jobs is an array, default to empty array if undefined or null
          return data.jobs ?? [];
      };
      try {
        
        const jobsData = await fetchUserJobs();
        setJobs(jobsData);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return <div className="p-4 text-center">Loading jobs...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error} Failed to load jobs.</div>;
  }

  if (jobs.length === 0) {
    return <div className="p-4 text-center text-gray-500">You haven&apos;t posted any jobs yet.</div>;
  }

  // Helper function to get status badge styles
  const getStatusClasses = (status: Job['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-red-100 text-red-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 md:p-6"> {/* Increased padding for the component container */}
      {/* Removed the H3 "My Job Postings" as the parent page already has a similar title. Or we can decide to keep it if sections are to be self-contained with titles */}
      {/* <h3 className="text-xl font-semibold mb-4 text-gray-700">My Job Postings</h3> */}
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-150 ease-in-out">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">{job.title}</h4>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusClasses(job.status)}`}
              >
                {job.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Applicants: <span className="font-medium text-gray-800">{job.applicantsCount}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyJobListings;
