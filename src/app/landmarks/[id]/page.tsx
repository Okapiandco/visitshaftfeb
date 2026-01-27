'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, ArrowLeft, Info, ExternalLink, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Landmark } from '@/types';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function LandmarkDetailPage() {
  const params = useParams();
  const [landmark, setLandmark] = useState<Landmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLandmark = async () => {
      const { data, error } = await supabase
        .from('landmarks')
        .select('*')
        .eq('id', params.id)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setLandmark(data);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchLandmark();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#013220] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading landmark...</p>
        </div>
      </div>
    );
  }

  if (error || !landmark) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#013220] mb-4">Landmark Not Found</h1>
          <p className="text-gray-600 mb-6">This landmark may have been removed or is no longer available.</p>
          <Link
            href="/landmarks"
            className="inline-flex items-center px-6 py-3 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Landmarks
          </Link>
        </div>
      </div>
    );
  }

  const shareLandmark = () => {
    if (navigator.share) {
      navigator.share({
        title: landmark.name,
        text: `Check out ${landmark.name} in Shaftesbury!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-[#F9F7F2] min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] bg-[#013220]">
        {landmark.image_url ? (
          <>
            <img
              src={landmark.image_url}
              alt={landmark.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-24 w-24 text-[#C5A059]" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/landmarks"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Landmarks
            </Link>
            <div className="flex items-center gap-3 mb-2">
              {landmark.type && (
                <span className="bg-[#C5A059] text-[#013220] px-3 py-1 rounded-full text-sm font-medium">
                  {landmark.type}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{landmark.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 shadow-md">
                <h2 className="text-2xl font-bold text-[#013220] mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {landmark.description}
                </p>
              </div>

              {/* Map */}
              {landmark.lat && landmark.lng && (
                <div className="bg-white rounded-xl p-8 shadow-md mt-8">
                  <h2 className="text-2xl font-bold text-[#013220] mb-4">Location</h2>
                  <Map
                    center={[landmark.lat, landmark.lng]}
                    zoom={15}
                    markers={[
                      {
                        lat: landmark.lat,
                        lng: landmark.lng,
                        title: landmark.name,
                        description: landmark.description,
                      },
                    ]}
                    className="h-[400px] rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                <h3 className="text-lg font-semibold text-[#013220] mb-4">
                  Visitor Information
                </h3>
                <div className="space-y-4">
                  {landmark.distance && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#C5A059] mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#013220]">Distance</div>
                        <div className="text-gray-600">{landmark.distance}</div>
                      </div>
                    </div>
                  )}
                  {landmark.key_info && (
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-[#C5A059] mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#013220]">Key Info</div>
                        <div className="text-gray-600 whitespace-pre-line">{landmark.key_info}</div>
                      </div>
                    </div>
                  )}
                  {landmark.lat && landmark.lng && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#C5A059] mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#013220]">Coordinates</div>
                        <div className="text-gray-600 text-sm">
                          {landmark.lat.toFixed(4)}, {landmark.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {landmark.website_url && (
                    <a
                      href={landmark.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#C5A059] text-[#013220] font-semibold rounded-lg hover:bg-[#d4af6a] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  )}
                  {landmark.lat && landmark.lng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${landmark.lat},${landmark.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </a>
                  )}
                  <button
                    onClick={shareLandmark}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-[#013220] text-[#013220] font-semibold rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
