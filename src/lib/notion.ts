import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Database IDs
const DATABASES = {
  events: process.env.NOTION_EVENTS_DB!,
  accommodation: process.env.NOTION_ACCOMMODATION_DB!,
  dining: process.env.NOTION_DINING_DB!,
  landmarks: process.env.NOTION_LANDMARKS_DB!,
};

// Helper to extract text from rich_text property
function getRichText(prop: any): string {
  if (!prop || prop.type !== 'rich_text') return '';
  return prop.rich_text?.[0]?.plain_text || '';
}

// Helper to extract title
function getTitle(prop: any): string {
  if (!prop || prop.type !== 'title') return '';
  return prop.title?.[0]?.plain_text || '';
}

// Helper to extract URL
function getUrl(prop: any): string {
  if (!prop || prop.type !== 'url') return '';
  return prop.url || '';
}

// Helper to extract number
function getNumber(prop: any): number {
  if (!prop || prop.type !== 'number') return 0;
  return prop.number || 0;
}

// Helper to extract date
function getDate(prop: any): string {
  if (!prop || prop.type !== 'date') return '';
  return prop.date?.start || '';
}

// Helper to extract select
function getSelect(prop: any): string {
  if (!prop || prop.type !== 'select') return '';
  return prop.select?.name || '';
}

// Helper to extract files (for images)
function getFiles(prop: any): string {
  if (!prop || prop.type !== 'files') return '';
  const file = prop.files?.[0];
  if (!file) return '';
  // Handle both external and Notion-hosted files
  return file.external?.url || file.file?.url || '';
}

// Types matching existing app structure
export interface NotionLandmark {
  id: string;
  name: string;
  description: string;
  type: string;
  distance: string;
  key_info: string;
  lat: number;
  lng: number;
  image_url: string;
  sort_order: number;
}

export interface NotionEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
  category: string;
  image_url: string;
  submitter_name: string;
  submitter_email: string;
}

export interface NotionAccommodation {
  id: string;
  name: string;
  type: string;
  feature: string;
  image_url: string;
  website_url: string;
  sort_order: number;
}

export interface NotionDining {
  id: string;
  name: string;
  type: string;
  feature: string;
  image_url: string;
  website_url: string;
  sort_order: number;
}

// Fetch all landmarks
export async function getLandmarks(): Promise<NotionLandmark[]> {
  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 100
    });

    const dbId = DATABASES.landmarks.replace(/-/g, '');
    const pages = response.results.filter((p: any) => {
      const parentId = p.parent?.database_id?.replace(/-/g, '');
      return parentId === dbId;
    });

    return pages.map((page: any) => ({
      id: page.id,
      name: getRichText(page.properties.name),
      description: getRichText(page.properties.description),
      type: getRichText(page.properties.type),
      distance: getRichText(page.properties.distance),
      key_info: getRichText(page.properties.key_info),
      lat: getNumber(page.properties.lat),
      lng: getNumber(page.properties.lng),
      image_url: getUrl(page.properties.image_url),
      sort_order: getNumber(page.properties.sort_order),
    })).sort((a, b) => a.sort_order - b.sort_order);
  } catch (error) {
    console.error('Error fetching landmarks:', error);
    return [];
  }
}

// Fetch single landmark by ID
export async function getLandmarkById(id: string): Promise<NotionLandmark | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id }) as any;

    return {
      id: page.id,
      name: getRichText(page.properties.name),
      description: getRichText(page.properties.description),
      type: getRichText(page.properties.type),
      distance: getRichText(page.properties.distance),
      key_info: getRichText(page.properties.key_info),
      lat: getNumber(page.properties.lat),
      lng: getNumber(page.properties.lng),
      image_url: getUrl(page.properties.image_url),
      sort_order: getNumber(page.properties.sort_order),
    };
  } catch (error) {
    console.error('Error fetching landmark:', error);
    return null;
  }
}

// Fetch all published events (filters out past events by default)
export async function getEvents(includePast: boolean = false): Promise<NotionEvent[]> {
  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 100
    });

    const dbId = DATABASES.events.replace(/-/g, '');
    const pages = response.results.filter((p: any) => {
      const parentId = p.parent?.database_id?.replace(/-/g, '');
      return parentId === dbId;
    });

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return pages
      .map((page: any) => ({
        id: page.id,
        title: getTitle(page.properties['Event Name']),
        date: getDate(page.properties.Date),
        time: getRichText(page.properties.Time),
        location: getRichText(page.properties.Location),
        description: getRichText(page.properties.Description),
        status: getSelect(page.properties.Status),
        category: getSelect(page.properties.Category) || 'General',
        image_url: getFiles(page.properties.Image),
        submitter_name: getRichText(page.properties['Submitter Name']),
        submitter_email: getRichText(page.properties['Submitter Email']),
      }))
      .filter(event => event.status === 'Approved')
      .filter(event => {
        if (includePast) return true;
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Fetch single event by ID
export async function getEventById(id: string): Promise<NotionEvent | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id }) as any;

    return {
      id: page.id,
      title: getTitle(page.properties['Event Name']),
      date: getDate(page.properties.Date),
      time: getRichText(page.properties.Time),
      location: getRichText(page.properties.Location),
      description: getRichText(page.properties.Description),
      status: getSelect(page.properties.Status),
      category: getSelect(page.properties.Category) || 'General',
      image_url: getFiles(page.properties.Image),
      submitter_name: getRichText(page.properties['Submitter Name']),
      submitter_email: getRichText(page.properties['Submitter Email']),
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

// Create a new event submission
export async function createEventSubmission(data: {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  submitter_name: string;
  submitter_email: string;
  image_url?: string;
}): Promise<boolean> {
  try {
    await notion.pages.create({
      parent: { database_id: DATABASES.events },
      properties: {
        'Event Name': {
          title: [{ text: { content: data.title } }]
        },
        'Date': {
          date: { start: data.date }
        },
        'Time': {
          rich_text: [{ text: { content: data.time } }]
        },
        'Location': {
          rich_text: [{ text: { content: data.location } }]
        },
        'Description': {
          rich_text: [{ text: { content: data.description } }]
        },
        'Submitter Name': {
          rich_text: [{ text: { content: data.submitter_name } }]
        },
        'Submitter Email': {
          rich_text: [{ text: { content: data.submitter_email } }]
        },
        'Status': {
          select: { name: 'Pending' }
        },
      } as any,
    });
    return true;
  } catch (error) {
    console.error('Error creating event:', error);
    return false;
  }
}

// Fetch all accommodation
export async function getAccommodation(): Promise<NotionAccommodation[]> {
  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 100
    });

    const dbId = DATABASES.accommodation.replace(/-/g, '');
    const pages = response.results.filter((p: any) => {
      const parentId = p.parent?.database_id?.replace(/-/g, '');
      return parentId === dbId;
    });

    return pages
      .map((page: any) => ({
        id: page.id,
        name: getRichText(page.properties.name),
        type: getRichText(page.properties.type),
        feature: getRichText(page.properties.feature),
        image_url: getUrl(page.properties.image_url),
        website_url: getUrl(page.properties.website_url),
        sort_order: getNumber(page.properties.sort_order),
      }))
      .sort((a, b) => a.sort_order - b.sort_order);
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    return [];
  }
}

// Fetch all dining
export async function getDining(): Promise<NotionDining[]> {
  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 100
    });

    const dbId = DATABASES.dining.replace(/-/g, '');
    const pages = response.results.filter((p: any) => {
      const parentId = p.parent?.database_id?.replace(/-/g, '');
      return parentId === dbId;
    });

    return pages
      .map((page: any) => ({
        id: page.id,
        name: getRichText(page.properties.name),
        type: getRichText(page.properties.type),
        feature: getRichText(page.properties.feature),
        image_url: getUrl(page.properties.image_url),
        website_url: getUrl(page.properties.website_url),
        sort_order: getNumber(page.properties.sort_order),
      }))
      .sort((a, b) => a.sort_order - b.sort_order);
  } catch (error) {
    console.error('Error fetching dining:', error);
    return [];
  }
}

export default notion;
