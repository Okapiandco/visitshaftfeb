'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, FileText, ArrowLeft, CheckCircle, AlertCircle, User, Mail } from 'lucide-react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

export default function SubmitEventPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    submitter_name: '',
    submitter_email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!turnstileToken) {
      setError('Please complete the security check');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/submit-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit event');
      }

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit event. Please try again.';
      setError(errorMessage);
      // Reset Turnstile on error
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#013220] mb-2">Event Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your event. Our team will review it and publish it once approved.
            </p>
            <div className="space-y-3">
              <Link
                href="/events"
                className="block w-full py-3 px-4 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors text-center"
              >
                View All Events
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setTurnstileToken(null);
                  setFormData({
                    title: '',
                    date: '',
                    time: '',
                    location: '',
                    description: '',
                    submitter_name: '',
                    submitter_email: '',
                  });
                }}
                className="block w-full py-3 px-4 border-2 border-[#013220] text-[#013220] font-semibold rounded-lg hover:bg-[#013220] hover:text-white transition-colors text-center"
              >
                Submit Another Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Header */}
      <section className="bg-[#013220] text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          <div className="flex items-center mb-2">
            <Calendar className="h-8 w-8 text-[#C5A059] mr-3" />
            <h1 className="text-3xl font-bold">Submit an Event</h1>
          </div>
          <p className="text-gray-300">
            Share your event with the Shaftesbury community. All submissions are reviewed before publishing.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your Details Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#013220] mb-4">Your Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="submitter_name" className="block text-sm font-medium text-[#013220] mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="submitter_name"
                        name="submitter_name"
                        type="text"
                        required
                        value={formData.submitter_name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="submitter_email" className="block text-sm font-medium text-[#013220] mb-2">
                      Your Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="submitter_email"
                        name="submitter_email"
                        type="email"
                        required
                        value={formData.submitter_email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details Section */}
              <div>
                <h2 className="text-lg font-semibold text-[#013220] mb-4">Event Details</h2>

                {/* Event Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-[#013220] mb-2">
                    Event Title *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Summer Festival in the Park"
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-[#013220] mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="date"
                        name="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-[#013220] mb-2">
                      Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="time"
                        name="time"
                        type="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-[#013220] mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Town Hall, High Street"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-[#013220] mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about your event..."
                  />
                </div>
              </div>

              {/* Turnstile CAPTCHA */}
              <div className="flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                  onSuccess={setTurnstileToken}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !turnstileToken}
                  className="w-full py-4 px-6 bg-[#C5A059] text-[#013220] font-semibold rounded-lg hover:bg-[#d4af6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? 'Submitting...' : 'Submit Event for Review'}
                </button>
                <p className="mt-3 text-center text-sm text-gray-500">
                  By submitting, you agree that your event information may be published on our website.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
