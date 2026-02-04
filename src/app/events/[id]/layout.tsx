import type { Metadata } from 'next';
import { getEventById } from '@/lib/notion';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const event = await getEventById(id);

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
