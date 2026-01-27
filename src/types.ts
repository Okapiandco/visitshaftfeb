export type EventStatus = 'pending' | 'published';

export interface ShaftesburyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string;
  website_url?: string;
  status: EventStatus;
  created_at?: string;
  lat?: number;
  lng?: number;
}

export interface Place {
  id: string;
  name: string;
  type: string;
  feature: string;
  image_url: string;
  website_url: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  full_name?: string;
}

export interface Landmark {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
  description: string;
  type?: string;
  distance?: string;
  image_url?: string;
  key_info?: string;
  website_url?: string;
  status?: 'pending' | 'published';
  created_at?: string;
}

export interface DiningPlace extends Place {
  lat?: number;
  lng?: number;
}

export interface AccommodationPlace extends Place {
  lat?: number;
  lng?: number;
}
