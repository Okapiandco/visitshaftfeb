'use client';

import dynamic from 'next/dynamic';
import { Share2 } from 'lucide-react';
import { NotionLandmark } from '@/lib/notion';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

interface LandmarkClientProps {
  landmark: NotionLandmark;
}

export default function LandmarkClient({ landmark }: LandmarkClientProps) {
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
    <>
      {/* Map */}
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

      {/* Share Button - positioned in sidebar via portal or passed as prop */}
      <div className="mt-4 lg:hidden">
        <button
          onClick={shareLandmark}
          className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-[#013220] text-[#013220] font-semibold rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </button>
      </div>
    </>
  );
}
