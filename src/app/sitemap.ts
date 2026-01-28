import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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

  // Dynamic pages from database
  let dynamicPages: MetadataRoute.Sitemap = [];

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch landmarks
    const { data: landmarks } = await supabase
      .from('landmarks')
      .select('id, updated_at')
      .order('sort_order', { ascending: true });

    if (landmarks) {
      const landmarkPages = landmarks.map((landmark) => ({
        url: `${baseUrl}/landmarks/${landmark.id}`,
        lastModified: landmark.updated_at ? new Date(landmark.updated_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
      dynamicPages = [...dynamicPages, ...landmarkPages];
    }

    // Fetch published events
    const { data: events } = await supabase
      .from('events')
      .select('id, created_at')
      .eq('status', 'published')
      .order('date', { ascending: true });

    if (events) {
      const eventPages = events.map((event) => ({
        url: `${baseUrl}/events/${event.id}`,
        lastModified: event.created_at ? new Date(event.created_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
      dynamicPages = [...dynamicPages, ...eventPages];
    }
  }

  return [...staticPages, ...dynamicPages];
}
