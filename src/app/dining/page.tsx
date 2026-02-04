import { Metadata } from 'next';
import { Utensils, ExternalLink, MapPin } from 'lucide-react';
import { getDining } from '@/lib/notion';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Dining',
  description: 'Discover the best restaurants, pubs, and cafes in Shaftesbury, Dorset. From fine dining to cosy pubs, find the perfect place to eat.',
};

export default async function DiningPage() {
  const diningPlaces = await getDining();

  return (
    <div className="bg-[#F9F7F2] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#013220] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Utensils className="h-8 w-8 text-[#C5A059] mr-3" />
            <h1 className="text-4xl font-bold">Where to Eat</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl">
            From award-winning gastropubs to charming cafes, Shaftesbury offers
            a diverse culinary scene with locally sourced ingredients.
          </p>
        </div>
      </section>

      {/* Dining Places */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {diningPlaces.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#013220] mb-2">No Places Listed Yet</h2>
              <p className="text-gray-600">Check back soon for dining recommendations!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {diningPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  {place.image_url && (
                    <div className="relative h-48">
                      <img
                        src={place.image_url}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      {place.type && (
                        <div className="absolute top-4 left-4 bg-[#C5A059] text-[#013220] px-3 py-1 rounded-full text-sm font-medium">
                          {place.type}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-[#013220] mb-2">
                      {place.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{place.feature}</p>
                    {place.website_url && place.website_url !== '#' && (
                      <a
                        href={place.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#013220] font-medium hover:text-[#C5A059] transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#013220] mb-8 text-center">
            Find Restaurants Near You
          </h2>
          <div className="bg-[#F9F7F2] rounded-xl p-8 text-center">
            <MapPin className="h-16 w-16 text-[#C5A059] mx-auto mb-4" />
            <p className="text-gray-600">
              All dining options are located within walking distance of the town centre.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
