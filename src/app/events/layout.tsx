import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events in Shaftesbury',
  description:
    'Discover upcoming events in Shaftesbury, Dorset. From traditional markets and festivals to cultural celebrations, find out what\'s happening in our historic town.',
  openGraph: {
    title: 'Events in Shaftesbury, Dorset',
    description:
      'Discover upcoming events in Shaftesbury. From markets and festivals to cultural celebrations.',
    url: 'https://visitshaftesbury.co.uk/events',
  },
  alternates: {
    canonical: 'https://visitshaftesbury.co.uk/events',
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
