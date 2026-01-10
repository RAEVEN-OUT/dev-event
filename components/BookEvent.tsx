'use client'
import React, { useState } from 'react'
import { createBooking } from '@/lib/actions/booking.action';
import posthog from 'posthog-js';

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit=async(e: React.FormEvent)=>{
        e.preventDefault();
        const response = await createBooking({ eventId, email });
        
        if(response.success){
            setSubmitted(true);
            setMessage(response.message || 'Thank you for signing up!');
            setIsError(false);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            setMessage(response.message || 'Booking failed. Please try again.');
            setIsError(true);
            console.error('Booking failed:', response.message);
            posthog.captureException('Booking Failed');
        }
    }

    return (
        <div id='book-event'>
            {submitted ? (
                <p className='text-sm text-green-600'>{message}</p>
            ) : (
                <>
                    {message && (
                        <p className={`text-sm mb-3 ${isError ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id='email'
                                required
                            />
                        </div>
                        <button type='submit' className="button-submit">Submit</button>
                    </form>
                </>
            )}
        </div>
    )
}

export default BookEvent