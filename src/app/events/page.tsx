'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ShaftesburyEvent } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState<ShaftesburyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: true });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

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
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#013220] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
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
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow block break-inside-avoid mb-8"
                >
                  <div className="relative bg-gray-200">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-[#013220]">
                        <Calendar className="h-16 w-16 text-[#C5A059]" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-[#013220] text-white px-4 py-2 rounded-lg">
                      <div className="text-2xl font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm uppercase">
                        {new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-[#013220] group-hover:text-[#C5A059] transition-colors mb-3">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[#C5A059]" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-[#C5A059]" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
