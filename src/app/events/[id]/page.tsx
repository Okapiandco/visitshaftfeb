import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { getEventById } from '@/lib/notion';
import { notFound } from 'next/navigation';
import EventClient from './EventClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  // Hide unapproved or past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event?.date || '');
  eventDate.setHours(0, 0, 0, 0);

  if (!event || event.status !== 'Approved' || eventDate < today) {
    notFound();
  }

  return (
    <div className="bg-[#F9F7F2] min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] bg-[#013220]">
        {event.image_url ? (
          <>
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="h-24 w-24 text-[#C5A059]" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/events"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 shadow-md">
                <h2 className="text-2xl font-bold text-[#013220] mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                <h3 className="text-lg font-semibold text-[#013220] mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-[#C5A059] mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#013220]">Date</div>
                      <div className="text-gray-600">
                        {new Date(event.date).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-[#C5A059] mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#013220]">Time</div>
                      <div className="text-gray-600">{event.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-[#C5A059] mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#013220]">Location</div>
                      <div className="text-gray-600">{event.location}</div>
                    </div>
                  </div>
                </div>

                <EventClient event={event} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
