'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Landmark } from '@/types';

export default function LandmarksPage() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandmarks = async () => {
      const { data, error } = await supabase
        .from('landmarks')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLandmarks(data);
      }
      setLoading(false);
    };

    fetchLandmarks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#013220] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading landmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7F2] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#013220] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <MapPin className="h-8 w-8 text-[#C5A059] mr-3" />
            <h1 className="text-4xl font-bold">Explore Shaftesbury</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl">
            Discover our historic landmarks, scenic viewpoints, and natural
            attractions. From the iconic Gold Hill to tranquil nature reserves.
          </p>
        </div>
      </section>

      {/* Landmarks Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {landmarks.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#013220] mb-2">No Landmarks Yet</h2>
              <p className="text-gray-600">Check back soon for exciting places to explore!</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {landmarks.map((landmark) => (
                <Link
                  key={landmark.id}
                  href={`/landmarks/${landmark.id}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow break-inside-avoid"
                >
                  {landmark.image_url && (
                    <div className="relative">
                      <img
                        src={landmark.image_url}
                        alt={landmark.name}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {landmark.type && (
                        <div className="absolute top-4 left-4 bg-[#C5A059] text-[#013220] px-3 py-1 rounded-full text-sm font-medium">
                          {landmark.type}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-[#013220] group-hover:text-[#C5A059] transition-colors mb-2">
                      {landmark.name}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {landmark.description}
                    </p>
                    {landmark.distance && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1 text-[#C5A059]" />
                        {landmark.distance}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
