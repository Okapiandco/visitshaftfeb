'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Filter } from 'lucide-react';
import type { NotionEvent } from '@/lib/notion';

interface EventsClientProps {
  events: NotionEvent[];
}

const CATEGORIES = ['All', 'Food', 'Arts', 'General', 'Market', 'Music', 'Festival'];

export default function EventsClient({ events }: EventsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories from events (plus predefined ones)
  const eventCategories = [...new Set(events.map(e => e.category))];
  const allCategories = ['All', ...new Set([...eventCategories, ...CATEGORIES.slice(1)])];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(event => event.category === selectedCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#013220]" />
          <span className="font-medium text-[#013220]">Filter by category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#013220] text-white'
                  : 'bg-white text-[#013220] border border-[#013220] hover:bg-[#013220] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600">No events found</h2>
          <p className="text-gray-500 mt-2">
            {selectedCategory === 'All'
              ? 'Check back soon for new events!'
              : `No ${selectedCategory} events at the moment.`}
          </p>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 text-[#C5A059] hover:underline"
            >
              View all events
            </button>
          )}
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {filteredEvents.map((event) => (
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
                {event.category && event.category !== 'General' && (
                  <div className="absolute top-4 right-4 bg-[#C5A059] text-[#013220] px-3 py-1 rounded-full text-xs font-semibold">
                    {event.category}
                  </div>
                )}
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
    </>
  );
}
