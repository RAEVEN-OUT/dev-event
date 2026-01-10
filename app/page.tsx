import React from 'react'
import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'
import { cacheLife } from 'next/cache'
import { IEvent } from '@/database/event.model'

const page = async() => {
  'use cache'
  cacheLife('hours');
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = baseUrl?.startsWith('http') ? `${baseUrl}/api/events` : `https://${baseUrl}/api/events`;
    
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    
    const data = await res.json();
    const events = data.events || [];

    return (
      <section>
        <h1 className='text-center'>The Hub for Every Dev <br /> Event You Can't Miss</h1>
        <p className='text-center mt-5'>Hackathons, Meetups, and Conferences, All in One Place</p>
        <ExploreBtn />
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <ul className='events'>
            {events && events.length > 0 ? events.map((event: IEvent) => (
              <li key={event.title} className='list-none'>
                <EventCard {...event}/>
              </li> 
            )) : (
              <li className='list-none text-center py-8'>
                <p>No events available at the moment.</p>
              </li>
            )}
          </ul>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Failed to fetch events:', error);
    
    return (
      <section>
        <h1 className='text-center'>The Hub for Every Dev <br /> Event You Can't Miss</h1>
        <p className='text-center mt-5'>Hackathons, Meetups, and Conferences, All in One Place</p>
        <ExploreBtn />
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <ul className='events'>
            <li className='list-none text-center py-8'>
              <p>Events will be available soon. Please check back later.</p>
            </li>
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1 className='text-center'>The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className='events'>
          {events && events.length>0 &&events.map((event: IEvent)=>(
            <li key={event.title} className='list-none'>
              <EventCard {...event}/>
            </li> 
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page