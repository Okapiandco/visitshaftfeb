'use client';

import { Share2 } from 'lucide-react';
import { NotionEvent } from '@/lib/notion';

interface EventClientProps {
  event: NotionEvent;
}

export default function EventClient({ event }: EventClientProps) {
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} in Shaftesbury!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={shareEvent}
        className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-[#013220] text-[#013220] font-semibold rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share Event
      </button>
    </div>
  );
}
