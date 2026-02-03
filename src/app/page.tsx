import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Utensils, Bed, ArrowRight } from 'lucide-react';
import { LANDMARKS } from '@/constants';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering and disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Create Supabase client at runtime (not module load time)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const metadata: Metadata = {
  title: 'Visit Shaftesbury - Discover Historic Dorset | Gold Hill & More',
  description:
    'Plan your visit to Shaftesbury, Dorset. Explore the iconic Gold Hill, historic abbey ruins, local events, dining, and accommodation in this beautiful hilltop town.',
  openGraph: {
    title: 'Visit Shaftesbury - Discover Historic Dorset',
    description:
      'Plan your visit to Shaftesbury, Dorset. Explore the iconic Gold Hill, historic abbey ruins, local events, and more.',
    url: 'https://visitshaftesbury.co.uk',
  },
  alternates: {
    canonical: 'https://visitshaftesbury.co.uk',
  },
};

export default async function HomePage() {
  const featuredLandmarks = LANDMARKS.slice(0, 4);

  // Fetch real events from Supabase
  const supabase = getSupabase();
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: true })
    .limit(3);

  const upcomingEvents = events || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.postimg.cc/SKvjQ0th/gold_hill_shaftesbury_2.jpg"
            alt="Gold Hill, Shaftesbury"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Shaftesbury
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover England&apos;s most iconic hilltop town, home to the famous Gold Hill
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/landmarks"
              className="inline-flex items-center px-6 py-3 bg-[#C5A059] text-[#013220] font-semibold rounded-lg hover:bg-[#d4af6a] transition-colors"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Explore Landmarks
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-colors"
            >
              <Calendar className="mr-2 h-5 w-5" />
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              href="/landmarks"
              className="flex flex-col items-center p-6 bg-[#F9F7F2] rounded-xl hover:shadow-lg transition-shadow text-center group"
            >
              <MapPin className="h-10 w-10 text-[#013220] mb-3 group-hover:text-[#C5A059] transition-colors" />
              <span className="font-semibold text-[#013220]">Explore</span>
              <span className="text-sm text-gray-600">Discover landmarks</span>
            </Link>
            <Link
              href="/events"
              className="flex flex-col items-center p-6 bg-[#F9F7F2] rounded-xl hover:shadow-lg transition-shadow text-center group"
            >
              <Calendar className="h-10 w-10 text-[#013220] mb-3 group-hover:text-[#C5A059] transition-colors" />
              <span className="font-semibold text-[#013220]">Events</span>
              <span className="text-sm text-gray-600">What&apos;s on</span>
            </Link>
            <Link
              href="/dining"
              className="flex flex-col items-center p-6 bg-[#F9F7F2] rounded-xl hover:shadow-lg transition-shadow text-center group"
            >
              <Utensils className="h-10 w-10 text-[#013220] mb-3 group-hover:text-[#C5A059] transition-colors" />
              <span className="font-semibold text-[#013220]">Dining</span>
              <span className="text-sm text-gray-600">Where to eat</span>
            </Link>
            <Link
              href="/accommodation"
              className="flex flex-col items-center p-6 bg-[#F9F7F2] rounded-xl hover:shadow-lg transition-shadow text-center group"
            >
              <Bed className="h-10 w-10 text-[#013220] mb-3 group-hover:text-[#C5A059] transition-colors" />
              <span className="font-semibold text-[#013220]">Stay</span>
              <span className="text-sm text-gray-600">Accommodation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Landmarks */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#013220]">Discover Shaftesbury</h2>
              <p className="text-gray-600 mt-2">Explore our top landmarks and attractions</p>
            </div>
            <Link
              href="/landmarks"
              className="hidden md:flex items-center text-[#013220] font-semibold hover:text-[#C5A059] transition-colors"
            >
              View all
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLandmarks.map((landmark) => (
              <Link
                key={landmark.id}
                href={`/landmarks/${landmark.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={landmark.image_url || '/placeholder.jpg'}
                    alt={landmark.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#013220] group-hover:text-[#C5A059] transition-colors">
                    {landmark.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {landmark.description}
                  </p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {landmark.distance}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/landmarks"
              className="inline-flex items-center text-[#013220] font-semibold hover:text-[#C5A059] transition-colors"
            >
              View all landmarks
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#013220]">Upcoming Events</h2>
              <p className="text-gray-600 mt-2">See what&apos;s happening in Shaftesbury</p>
            </div>
            <Link
              href="/events"
              className="hidden md:flex items-center text-[#013220] font-semibold hover:text-[#C5A059] transition-colors"
            >
              View all events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group bg-[#F9F7F2] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#013220] flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-[#C5A059]" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#013220] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {new Date(event.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#013220] group-hover:text-[#C5A059] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                    <p className="text-sm text-[#C5A059] mt-1">{event.time}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No upcoming events at the moment.</p>
                <Link href="/events" className="text-[#C5A059] hover:underline mt-2 inline-block">
                  Check back soon
                </Link>
              </div>
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/events"
              className="inline-flex items-center text-[#013220] font-semibold hover:text-[#C5A059] transition-colors"
            >
              View all events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-[#013220] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About Shaftesbury</h2>
              <p className="text-gray-300 mb-4">
                Perched on a hilltop 700 feet above the Blackmore Vale, Shaftesbury is one
                of England&apos;s oldest and most historic towns. Founded by King Alfred the
                Great in 880 AD, the town has been a place of pilgrimage and commerce for
                over a millennium.
              </p>
              <p className="text-gray-300 mb-6">
                Today, Shaftesbury is best known for Gold Hill, the iconic cobbled street
                that starred in the famous Hovis bread advertisement directed by Ridley Scott.
                But there&apos;s so much more to discover in this charming Dorset town.
              </p>
              <Link
                href="/history"
                className="inline-flex items-center px-6 py-3 bg-[#C5A059] text-[#013220] font-semibold rounded-lg hover:bg-[#d4af6a] transition-colors"
              >
                Learn Our History
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src="https://i.postimg.cc/SKvjQ0th/gold_hill_shaftesbury_2.jpg"
                alt="Historic Shaftesbury - Gold Hill"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
