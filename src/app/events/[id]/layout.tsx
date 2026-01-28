import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  if (!supabaseUrl || !supabaseKey) {
    return {
      title: 'Event Details',
      description: 'View event details in Shaftesbury, Dorset.',
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: event } = await supabase
    .from('events')
    .select('title, description, date, location, image_url')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'This event could not be found.',
    };
  }

  const eventDate = new Date(event.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    title: event.title,
    description: `${event.description.slice(0, 150)}... Join us on ${eventDate} at ${event.location}.`,
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 200),
      url: `https://visitshaftesbury.co.uk/events/${id}`,
      type: 'article',
      images: event.image_url
        ? [
            {
              url: event.image_url,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description.slice(0, 200),
      images: event.image_url ? [event.image_url] : undefined,
    },
    alternates: {
      canonical: `https://visitshaftesbury.co.uk/events/${id}`,
    },
  };
}

export default function EventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
