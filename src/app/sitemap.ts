import { MetadataRoute } from 'next';
import { getLandmarks, getEvents } from '@/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://visitshaftesbury.co.uk';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/landmarks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dining`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/accommodation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/history`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/transport`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/submit-event`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic pages from Notion
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // Fetch landmarks from Notion
    const landmarks = await getLandmarks();
    const landmarkPages = landmarks.map((landmark) => ({
      url: `${baseUrl}/landmarks/${landmark.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    dynamicPages = [...dynamicPages, ...landmarkPages];

    // Fetch events from Notion
    const events = await getEvents();
    const eventPages = events.map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    dynamicPages = [...dynamicPages, ...eventPages];
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }

  return [...staticPages, ...dynamicPages];
}
