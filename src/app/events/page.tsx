import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { getEvents } from '@/lib/notion';
import EventsClient from './EventsClient';

// Force dynamic rendering and disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function EventsPage() {
  // Fetch only upcoming events (past events are filtered out)
  const events = await getEvents();

  return (
    <div className="bg-[#F9F7F2] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#013220] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-[#C5A059] mr-3" />
                <h1 className="text-4xl font-bold">Events in Shaftesbury</h1>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl">
                Discover what&apos;s happening in our historic town. From traditional markets
                to cultural celebrations, there&apos;s always something to experience.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/submit-event"
                className="inline-flex items-center px-6 py-3 bg-[#C5A059] text-[#013220] font-semibold rounded-lg hover:bg-[#d4af6a] transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Submit an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600">No upcoming events</h2>
              <p className="text-gray-500 mt-2 mb-6">Check back soon for new events!</p>
              <Link
                href="/submit-event"
                className="inline-flex items-center px-6 py-3 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Submit Your Event
              </Link>
            </div>
          ) : (
            <EventsClient events={events} />
          )}
        </div>
      </section>

      {/* Submit Event CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#013220] mb-4">
            Have an event to share?
          </h2>
          <p className="text-gray-600 mb-6">
            If you&apos;re organizing an event in Shaftesbury, we&apos;d love to help spread the word.
            Submit your event for review and we&apos;ll publish it on our website.
          </p>
          <Link
            href="/submit-event"
            className="inline-flex items-center px-8 py-4 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Submit Your Event
          </Link>
        </div>
      </section>
    </div>
  );
}
