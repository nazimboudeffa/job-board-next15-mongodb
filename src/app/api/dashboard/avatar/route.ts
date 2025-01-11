import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/config-db";
import Profile from '@/lib/models/Profile';
import { auth } from '@/lib/auth';

export async function GET() {
    try {

        const session = await auth();

        // Vérification de la session utilisateur
        console.log('Session Avatar:', session);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

            // Vérification supplémentaire de l'ID utilisateur
            if (!session.user.id) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 403 });
        }

        await connectDB();

        // Filtrer explicitement par userId
        const profile = await Profile.findOne({ 
            userId: session.user.id  // Utilisez directement l'ID de la session
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        console.log('Avatar:', profile.image);

        return NextResponse.json({ avatar : profile.image }, { status: 200 });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}