import type { Metadata } from 'next';
import { getLandmarkById } from '@/lib/notion';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const landmark = await getLandmarkById(id);

  if (!landmark) {
    return {
      title: 'Landmark Not Found',
      description: 'This landmark could not be found.',
    };
  }

  const typeText = landmark.type ? ` - ${landmark.type}` : '';

  return {
    title: `${landmark.name}${typeText}`,
    description: `${landmark.description.slice(0, 150)}...`,
    openGraph: {
      title: `${landmark.name} - Shaftesbury Landmark`,
      description: landmark.description.slice(0, 200),
      url: `https://visitshaftesbury.co.uk/landmarks/${id}`,
      type: 'article',
      images: landmark.image_url
        ? [
            {
              url: landmark.image_url,
              width: 1200,
              height: 630,
              alt: landmark.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: landmark.name,
      description: landmark.description.slice(0, 200),
      images: landmark.image_url ? [landmark.image_url] : undefined,
    },
    alternates: {
      canonical: `https://visitshaftesbury.co.uk/landmarks/${id}`,
    },
  };
}

export default function LandmarkDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
