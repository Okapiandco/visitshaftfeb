import { Metadata } from 'next';
import { Bed, ExternalLink, MapPin, Star } from 'lucide-react';
import { getAccommodation } from '@/lib/notion';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Accommodation',
  description: 'Find the perfect place to stay in Shaftesbury, Dorset. From boutique B&Bs to country house hotels, we have accommodation for every budget.',
};

export default async function AccommodationPage() {
  const accommodationPlaces = await getAccommodation();

  return (
    <div className="bg-[#F9F7F2] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#013220] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Bed className="h-8 w-8 text-[#C5A059] mr-3" />
            <h1 className="text-4xl font-bold">Where to Stay</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl">
            From cosy bed & breakfasts to elegant country house hotels,
            find the perfect accommodation for your Shaftesbury visit.
          </p>
        </div>
      </section>

      {/* Accommodation Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {accommodationPlaces.length === 0 ? (
            <div className="text-center py-12">
              <Bed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#013220] mb-2">No Places Listed Yet</h2>
              <p className="text-gray-600">Check back soon for accommodation options!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodationPlaces.map((place) => (
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#C5A059]">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4" />
                      </div>
                      {place.website_url && place.website_url !== '#' && (
                        <a
                          href={place.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[#013220] font-medium hover:text-[#C5A059] transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Book
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#013220] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-[#C5A059]" />
              </div>
              <h3 className="text-lg font-semibold text-[#013220] mb-2">Central Location</h3>
              <p className="text-gray-600">
                Most accommodation is within walking distance of Gold Hill and the town centre.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#013220] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-[#C5A059]" />
              </div>
              <h3 className="text-lg font-semibold text-[#013220] mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                All our listed accommodations maintain high standards of hospitality.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#013220] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="h-8 w-8 text-[#C5A059]" />
              </div>
              <h3 className="text-lg font-semibold text-[#013220] mb-2">Every Budget</h3>
              <p className="text-gray-600">
                From cosy B&Bs to luxury hotels, we have options for every traveller.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
