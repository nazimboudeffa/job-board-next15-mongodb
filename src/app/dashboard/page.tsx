"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MyJobListings from '@/components/MyJobListings';
import AppliedFreelancers from '@/components/AppliedFreelancers';
// Removed unused imports: Card, BriefcaseBusiness, Rocket
// import Card from "@/components/DashboardCard";
// import { BriefcaseBusiness, Rocket } from "lucide-react"

function Dashboard() {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session) {
            redirect('/');
        }
    }, [session]);

    if (!session) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Post a New Job Section */}
            <div className="mb-8 p-6 border rounded-lg shadow-md bg-slate-50">
                <h2 className="text-2xl font-semibold mb-3">Post a New Job</h2>
                <p className="mb-5 text-gray-600">Click here to create a new job listing and find the perfect candidate.</p>
                <Button
                    onClick={() => redirect('/jobs/new')}
                    className="px-6 py-3 text-base" // Increased padding and text size for button
                >
                    Post a Job
                </Button>
            </div>

            {/* My Job Listings Section */}
            <div className="mb-8 border rounded-lg shadow-md bg-slate-50">
                {/* The h2 and MyJobListings component will provide their own padding */}
                <h2 className="text-2xl font-semibold mb-3 p-6 pb-0">My Job Listings</h2>
                <MyJobListings />
            </div>

            {/* Applicants Section */}
            <div className="mb-8 border rounded-lg shadow-md bg-slate-50"> {/* Added mb-8 for spacing consistent with other sections */}
                {/* The h2 and AppliedFreelancers component will provide their own padding */}
                <h2 className="text-2xl font-semibold mb-3 p-6 pb-0">Applicants</h2>
                <AppliedFreelancers />
            </div>
        </div>
    )
}

export default Dashboard;
