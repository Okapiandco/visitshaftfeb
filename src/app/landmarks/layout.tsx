import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Landmarks & Attractions',
  description:
    'Explore Shaftesbury\'s historic landmarks and attractions. From the iconic Gold Hill to ancient abbey ruins, discover the best places to visit in Dorset.',
  openGraph: {
    title: 'Landmarks & Attractions in Shaftesbury',
    description:
      'Explore Shaftesbury\'s historic landmarks. From Gold Hill to ancient abbey ruins.',
    url: 'https://visitshaftesbury.co.uk/landmarks',
  },
  alternates: {
    canonical: 'https://visitshaftesbury.co.uk/landmarks',
  },
};

export default function LandmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
