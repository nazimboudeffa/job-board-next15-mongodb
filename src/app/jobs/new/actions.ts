"use server";

import { toSlug } from "@/lib/helpers";
import { nanoid } from "nanoid";
import { connectDB } from "@/lib/config-db";
import Job from "@/lib/models/Job";
import { auth } from "@/lib/auth";
import { Types } from "mongoose";

export async function createJobPosting(formData: FormData) {
    try {
        // Récupérer la session de l'utilisateur
        const session = await auth();

        if (!session) {
            throw new Error("Utilisateur non authentifié");
        }

        await connectDB();

        const values = Object.fromEntries(formData.entries());

        console.log(values);

        await Job.collection.insertOne({
            title: values.title,
            slug: `${toSlug(values.title as string)}-${nanoid(10)}`,
            skills: Array.isArray(values.skills) ? values.skills : String(values.skills).split(","),
            type: values.type,
            company: values.company,
            location: values.location,
            salaryMin: values.salaryMin,
            salaryMax: values.salaryMax,
            description: values.description,
            createdAt: new Date(),
            // Ajouter l'ID de l'utilisateur
            userId: new Types.ObjectId(session?.user?.id),
        });

        console.log("Job posting created successfully");

    } catch (error) {
        console.error("Error creating job posting:", error);
        throw error; // Relancer l'erreur pour la gestion côté client
    }
}