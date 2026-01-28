import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LocalBusinessJsonLd, WebsiteJsonLd } from '@/components/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://visitshaftesbury.co.uk'),
  title: {
    default: 'Visit Shaftesbury - Discover Historic Dorset',
    template: '%s | Visit Shaftesbury',
  },
  description:
    'Discover the historic hilltop town of Shaftesbury, Dorset. Home to the iconic Gold Hill, Shaftesbury Abbey, and centuries of English heritage.',
  keywords: [
    'Shaftesbury',
    'Dorset',
    'Gold Hill',
    'Hovis',
    'Tourism',
    'England',
    'Historic Town',
    'Shaftesbury Abbey',
    'Things to do in Shaftesbury',
    'Visit Dorset',
  ],
  authors: [{ name: 'Visit Shaftesbury' }],
  creator: 'Visit Shaftesbury',
  publisher: 'Visit Shaftesbury',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://visitshaftesbury.co.uk',
    siteName: 'Visit Shaftesbury',
    title: 'Visit Shaftesbury - Discover Historic Dorset',
    description:
      'Discover the historic hilltop town of Shaftesbury, Dorset. Home to the iconic Gold Hill and centuries of English heritage.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Gold Hill, Shaftesbury - The iconic cobbled street in Dorset',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visit Shaftesbury - Discover Historic Dorset',
    description:
      'Discover the historic hilltop town of Shaftesbury, Dorset. Home to the iconic Gold Hill and centuries of English heritage.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have the verification codes
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://visitshaftesbury.co.uk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <WebsiteJsonLd />
        <LocalBusinessJsonLd
          data={{
            name: 'Shaftesbury',
            description:
              'Historic hilltop town in Dorset, England. Home to the iconic Gold Hill, Shaftesbury Abbey ruins, and centuries of English heritage.',
            url: 'https://visitshaftesbury.co.uk',
            image: 'https://visitshaftesbury.co.uk/og-image.jpg',
            address: {
              addressLocality: 'Shaftesbury',
              addressRegion: 'Dorset',
              postalCode: 'SP7',
              addressCountry: 'GB',
            },
            geo: {
              latitude: 51.0055,
              longitude: -2.1983,
            },
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main id="main-content" className="flex-grow" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
