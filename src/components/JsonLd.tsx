// JSON-LD Schema Components for SEO

interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

interface LocalBusinessSchema {
  name: string;
  description: string;
  url: string;
  image?: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  openingHours?: string[];
}

interface EventSchema {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: string;
  };
  image?: string;
  url?: string;
  organizer?: {
    name: string;
    url?: string;
  };
}

interface PlaceSchema {
  name: string;
  description: string;
  image?: string;
  address?: {
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  url?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

// Organization Schema
export function OrganizationJsonLd({ data }: { data: OrganizationSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    sameAs: data.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Local Business / Tourism Schema
export function LocalBusinessJsonLd({ data }: { data: LocalBusinessSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    geo: data.geo
      ? {
          '@type': 'GeoCoordinates',
          latitude: data.geo.latitude,
          longitude: data.geo.longitude,
        }
      : undefined,
    telephone: data.telephone,
    openingHours: data.openingHours,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Event Schema
export function EventJsonLd({ data }: { data: EventSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    location: {
      '@type': 'Place',
      name: data.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.location.address,
        addressLocality: 'Shaftesbury',
        addressRegion: 'Dorset',
        addressCountry: 'GB',
      },
    },
    image: data.image,
    url: data.url,
    organizer: data.organizer
      ? {
          '@type': 'Organization',
          name: data.organizer.name,
          url: data.organizer.url,
        }
      : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Place/Landmark Schema
export function PlaceJsonLd({ data }: { data: PlaceSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: data.name,
    description: data.description,
    image: data.image,
    address: data.address
      ? {
          '@type': 'PostalAddress',
          addressLocality: data.address.addressLocality,
          addressRegion: data.address.addressRegion,
          addressCountry: data.address.addressCountry,
        }
      : undefined,
    geo: data.geo
      ? {
          '@type': 'GeoCoordinates',
          latitude: data.geo.latitude,
          longitude: data.geo.longitude,
        }
      : undefined,
    url: data.url,
    isAccessibleForFree: true,
    publicAccess: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Website Schema (for site-wide search)
export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Visit Shaftesbury',
    url: 'https://visitshaftesbury.co.uk',
    description:
      'Discover the historic hilltop town of Shaftesbury, Dorset. Home to the iconic Gold Hill and centuries of English heritage.',
    publisher: {
      '@type': 'Organization',
      name: 'Visit Shaftesbury',
      url: 'https://visitshaftesbury.co.uk',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
