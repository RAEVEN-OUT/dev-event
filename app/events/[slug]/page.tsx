import { notFound } from 'next/navigation';
import Image from 'next/image';
import BookEvent from '@/components/BookEvent';
import { IEvent } from '@/database/event.model';
import { getSimilarEventsBySlug } from '@/lib/actions/event.action';
import EventCard from '@/components/EventCard';

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
    <div className='flex-row-gap-2 items-center'>
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className='flex flex-row gap-1.5 flex-wrap'>
        {tags.map((tag) => (
            <span className='pill' key={tag}>{tag}</span>
        ))}
    </div>
)

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    
    let event;
    let similarEvents: IEvent[] = [];
    
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const apiUrl = BASE_URL?.startsWith('http') ? `${BASE_URL}/api/events/${slug}` : `https://${BASE_URL}/api/events/${slug}`;
        
        const request = await fetch(apiUrl, {
            cache: 'no-store'
        });
        
        if (!request.ok) {
            if (request.status === 404) {
                return notFound();
            }
            throw new Error(`Failed to fetch event: ${request.statusText}`);
        }
        
        const response = await request.json();
        event = response.event;

        if (!event) {
            return notFound();
        }

        // Fetch similar events
        try {
            similarEvents = await getSimilarEventsBySlug(slug);
        } catch (error) {
            console.error('Failed to fetch similar events:', error);
            // Continue without similar events
        }
        
    } catch (e) {
        console.error('Error fetching event data:', e);
        return notFound();
    }

    const { description, image, overview, date, location, time, mode, agenda, organizer, audience, tags } = event;

    if (!description) return notFound();

    const bookings = 10;

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p className="mt-24">{description}</p>
            </div>

            <div className="details">
                <div className="content">
                    <Image src={image} alt='Event Banner' width={800} height={800} className='banner' />
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>
                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="Calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="Time" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="Location" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="Mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="Audience" label={audience} />
                    </section>
                    <EventAgenda agendaItems={agenda} />
                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>
                    <EventTags tags={tags} />
                </div>

                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className='text-sm'>
                                Join {bookings} people who have already booked their spot!
                            </p>
                        ) : (
                            <p className='text-sm'>
                                Be the first one to book your spot!
                            </p>
                        )}
                        <BookEvent eventId={event._id} slug={slug} />
                    </div>
                </aside>
            </div>
            
            {similarEvents.length > 0 && (
                <div className="flex w-full flex-col gap-4 pt-20">
                    <h2>Similar Events</h2>
                    <div className="events">
                        {similarEvents.map((similarEvent: IEvent) => (
                            <EventCard key={similarEvent.title} {...similarEvent} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}

export default EventDetailsPage

//final