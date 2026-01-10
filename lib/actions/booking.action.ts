'use server';

import Booking from '@/database/booking.model';

import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, email }: { eventId: string; email: string; }) => {
    try {
        await connectDB();

        // Check if user is already enrolled for this event
        const existingBooking = await Booking.findOne({ eventId, email });
        
        if (existingBooking) {
            return { 
                success: false, 
                message: 'Already enrolled! You have already booked this event.' 
            };
        }

        await Booking.create({ eventId, email });

        return { 
            success: true, 
            message: 'Booking successful! You have been enrolled for this event.' 
        };
    } catch (e) {
        console.error('create booking failed', e);
        
        // Handle MongoDB duplicate key error (in case the unique index catches it)
        if (e.code === 11000) {
            return { 
                success: false, 
                message: 'Already enrolled! You have already booked this event.' 
            };
        }
        
        return { 
            success: false, 
            message: 'Booking failed. Please try again.' 
        };
    }
}