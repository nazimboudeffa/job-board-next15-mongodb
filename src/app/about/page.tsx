"use client";
import Link from "next/link";
import { Globe, Briefcase, Users, Github, MessageSquare } from 'lucide-react';

export default function PP() {
    return (
        <main className="m-auto my-10 max-w-5xl space-y-8 px-3 text-center">
            <h1 className="text-4xl font-bold flex items-center justify-center">
                <Users className="w-10 h-10 mr-3 text-blue-500" /> About neoFreelance
            </h1>

            <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
                    <Users className="w-6 h-6 mr-2 text-gray-700" /> What is neoFreelance?
                </h2>
                <p className="mb-2">
                    neoFreelance is a place to connect Talents with Opportunities.
                    You can <Link href="/jobs" className="text-blue-500 hover:underline">find jobs</Link> or <Link href="/u" className="text-blue-500 hover:underline">browse profiles</Link>.
                </p>
                <p>
                    neoFreelance is a free and open-source project. It is not affiliated with any company or organization.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
                    <Globe className="w-6 h-6 mr-2 text-gray-700" /> Our Business Model
                </h2>
                <p className="mb-2">
                    The business model is based on donations and sponsorships.
                </p>
                <p className="mb-2">
                    The business you can make with neoFreelance is yours. We do not take any commission on your earnings (maybe later, no one knows).
                </p>
                <p>
                    When posting a job, you just have to provide a percentage you take on the daily rate of freelances.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 mr-2 text-gray-700" /> Key Features
                </h2>
                <ul className="list-disc list-inside space-y-1 text-left inline-block">
                    <li className="flex items-center"><Globe className="w-5 h-5 mr-2 text-green-500" /> Post jobs in USD, EUR, and DZD.</li>
                    <li className="flex items-center"><Briefcase className="w-5 h-5 mr-2 text-purple-500" /> Add up to three main skills per job (but you can add as many skills as you want in the description for future management).</li>
                    <li className="flex items-center"><Users className="w-5 h-5 mr-2 text-yellow-500" /> Profile daily rates are in EUR for consistency across all freelances.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-gray-700" /> Connect With Us
                </h2>
                <p className="mb-2 flex items-center justify-center">
                    <Github className="w-5 h-5 mr-2" /> If you find a bug, please open an issue on <Link href="https://github.com/rapidosaas" className="text-blue-500 hover:underline ml-1">GitHub</Link>.
                </p>
                <p className="flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 mr-2" /> If you have any questions or suggestions, feel free to contact us on <Link href="https://www.facebook.com/CodeurGrosArgent" className="text-blue-500 hover:underline ml-1">Facebook</Link>.
                </p>
            </section>

            <p className="mt-6">
                Thank you for using neoFreelance!
            </p>
        </main>
    )
}