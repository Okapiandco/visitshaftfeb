'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, FileText, Link as LinkIcon, ArrowLeft, CheckCircle, AlertCircle, Upload, X, LogIn, Repeat } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { RecurringType } from '@/types';

export default function SubmitEventPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image_url: '',
    website_url: '',
    recurring: 'none' as RecurringType,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setAuthLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `event-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('events')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('events')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        setUploadProgress(50);
        imageUrl = await uploadImage(imageFile) || '';
        setUploadProgress(100);
      }

      const eventData = {
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        description: formData.description,
        image_url: imageUrl,
        website_url: formData.website_url,
        recurring: formData.recurring,
        user_id: user.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { error: submitError } = await supabase
        .from('events')
        .insert([eventData]);

      if (submitError) throw submitError;

      setSuccess(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit event. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#013220] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-[#013220] rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-8 w-8 text-[#C5A059]" />
            </div>
            <h1 className="text-2xl font-bold text-[#013220] mb-2">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in or create an account to submit an event to the Shaftesbury community.
            </p>
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors text-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="block w-full py-3 px-4 border-2 border-[#013220] text-[#013220] font-semibold rounded-lg hover:bg-[#013220] hover:text-white transition-colors text-center"
              >
                Create Account
              </Link>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center text-gray-500 hover:text-[#013220] mt-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                href="/account"
                className="block w-full py-3 px-4 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors text-center"
              >
                View My Events
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setImageFile(null);
                  setImagePreview(null);
                  setFormData({
                    title: '',
                    date: '',
                    time: '',
                    location: '',
                    description: '',
                    image_url: '',
                    website_url: '',
                    recurring: 'none',
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
              {/* Event Title */}
              <div>
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-[#013220] mb-2">
                    {formData.recurring === 'none' ? 'Date *' : 'Starting Date *'}
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

              {/* Recurring Event */}
              <div>
                <label className="block text-sm font-medium text-[#013220] mb-2">
                  <div className="flex items-center">
                    <Repeat className="h-4 w-4 mr-2 text-gray-500" />
                    Recurring Event
                  </div>
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, recurring: 'none' }))}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.recurring === 'none'
                        ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#013220] font-medium'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    One-time event
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, recurring: 'weekly' }))}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.recurring === 'weekly'
                        ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#013220] font-medium'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, recurring: 'monthly' }))}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.recurring === 'monthly'
                        ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#013220] font-medium'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
                {formData.recurring !== 'none' && (
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.recurring === 'weekly'
                      ? 'This event repeats every week on the same day.'
                      : 'This event repeats every month on the same date.'}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#013220] mb-2">
                  Event Image <span className="text-gray-500 font-normal">(optional)</span>
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A059] hover:bg-gray-50 transition-all"
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP (max 5MB)</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#C5A059] h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading image...</p>
                  </div>
                )}

                <p className="mt-2 text-sm text-gray-500">
                  Upload an image for your event (recommended size: 1200x630px)
                </p>
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="website_url" className="block text-sm font-medium text-[#013220] mb-2">
                  Website URL <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="website_url"
                    name="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
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
