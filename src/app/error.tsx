'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#013220] mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-8">
            We apologise for the inconvenience. An unexpected error has occurred.
            Please try again or return to the homepage.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#C5A059] text-[#013220] font-semibold rounded-lg hover:bg-[#d4af6a] transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Homepage
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-400">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
