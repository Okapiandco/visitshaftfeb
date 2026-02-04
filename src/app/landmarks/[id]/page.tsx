import Link from 'next/link';
import { MapPin, ArrowLeft, Info, ExternalLink } from 'lucide-react';
import { getLandmarkById } from '@/lib/notion';
import { notFound } from 'next/navigation';
import LandmarkClient from './LandmarkClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LandmarkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const landmark = await getLandmarkById(id);

  if (!landmark) {
    notFound();
  }

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

              {/* Map - Client Component */}
              {landmark.lat && landmark.lng && (
                <LandmarkClient landmark={landmark} />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
