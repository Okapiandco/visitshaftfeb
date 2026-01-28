import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Calendar, Utensils, Bed, Car, History, User, FileText } from 'lucide-react';
import { LANDMARKS } from '@/constants';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Complete sitemap of Visit Shaftesbury website. Find all pages and landmarks in one place.',
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main Pages',
      icon: FileText,
      links: [
        { href: '/', label: 'Home' },
        { href: '/events', label: 'Events' },
        { href: '/landmarks', label: 'Explore Landmarks' },
        { href: '/dining', label: 'Dining' },
        { href: '/accommodation', label: 'Accommodation' },
        { href: '/transport', label: 'Getting Here' },
        { href: '/history', label: 'History' },
      ],
    },
    {
      title: 'Landmarks',
      icon: MapPin,
      links: LANDMARKS.map((landmark) => ({
        href: `/landmarks/${landmark.id}`,
        label: landmark.name,
      })),
    },
    {
      title: 'Account',
      icon: User,
      links: [
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' },
        { href: '/forgot-password', label: 'Forgot Password' },
      ],
    },
  ];

  return (
    <div className="bg-[#F9F7F2] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#013220] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-[#C5A059] mr-3" />
            <h1 className="text-4xl font-bold">Sitemap</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl">
            Find all the pages on our website in one convenient location.
          </p>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <section.icon className="h-6 w-6 text-[#C5A059] mr-2" />
                  <h2 className="text-xl font-bold text-[#013220]">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-700 hover:text-[#C5A059] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
