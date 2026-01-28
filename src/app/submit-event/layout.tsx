import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit an Event',
  description:
    'Submit your event to be featured on Visit Shaftesbury. Share local events, markets, festivals, and community gatherings with visitors.',
  openGraph: {
    title: 'Submit an Event to Visit Shaftesbury',
    description:
      'Share your local event with visitors to Shaftesbury.',
    url: 'https://visitshaftesbury.co.uk/submit-event',
  },
  alternates: {
    canonical: 'https://visitshaftesbury.co.uk/submit-event',
  },
};

export default function SubmitEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
