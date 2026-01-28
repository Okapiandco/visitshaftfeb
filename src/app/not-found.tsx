import Link from 'next/link';
import { MapPin, Home, Calendar, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#013220] rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-12 w-12 text-[#C5A059]" />
          </div>
          <h1 className="text-6xl font-bold text-[#013220] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#013220] mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            It may have been moved or no longer exists.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Homepage
          </Link>

          <div className="flex gap-4">
            <Link
              href="/landmarks"
              className="flex-1 inline-flex items-center justify-center px-4 py-3 border-2 border-[#013220] text-[#013220] font-semibold rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Explore Landmarks
            </Link>
            <Link
              href="/events"
              className="flex-1 inline-flex items-center justify-center px-4 py-3 border-2 border-[#013220] text-[#013220] font-semibold rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Events
            </Link>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Need help? <Link href="/site-map" className="text-[#C5A059] hover:underline">View our sitemap</Link>
        </p>
      </div>
    </div>
  );
}
