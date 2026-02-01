'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Calendar, Clock, MapPin, Plus, ArrowLeft, LogOut, Edit, Trash2, Eye, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { UserProfile, ShaftesburyEvent } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [myEvents, setMyEvents] = useState<ShaftesburyEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth check error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Fetch the user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            is_admin: profile?.is_admin || false,
            full_name: profile?.full_name || session.user.user_metadata?.full_name,
          });
          fetchMyEvents(session.user.id);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const fetchMyEvents = async (userId: string) => {
    setLoadingEvents(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      if (user) fetchMyEvents(user.id);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#013220] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#013220] mb-2">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to view your account.
            </p>
            <Link
              href="/login"
              className="block w-full py-3 px-4 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Header */}
      <div className="bg-[#013220] text-white py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-[#C5A059] rounded-full flex items-center justify-center mr-4">
              <User className="h-8 w-8 text-[#013220]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-gray-300">{user.email}</p>
              {user.is_admin && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#C5A059] text-[#013220] text-xs font-semibold rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/submit-event"
            className="flex items-center justify-center p-4 bg-[#013220] text-white rounded-lg hover:bg-[#014a2d] transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Submit New Event
          </Link>
          <Link
            href="/events"
            className="flex items-center justify-center p-4 bg-[#C5A059] text-[#013220] rounded-lg hover:bg-[#d4af6a] transition-colors"
          >
            <Eye className="h-5 w-5 mr-2" />
            View All Events
          </Link>
          {user.is_admin && (
            <Link
              href="/admin"
              className="flex items-center justify-center p-4 border-2 border-[#013220] text-[#013220] rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
            >
              <Settings className="h-5 w-5 mr-2" />
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* My Events */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#013220]">My Events</h2>
            <span className="text-sm text-gray-500">{myEvents.length} event(s)</span>
          </div>

          {loadingEvents ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-[#013220] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-500">Loading your events...</p>
            </div>
          ) : myEvents.length === 0 ? (
            <div className="text-center py-12 bg-[#F9F7F2] rounded-lg">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No events yet</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Submit your first event to share it with the Shaftesbury community.
              </p>
              <Link
                href="/submit-event"
                className="inline-flex items-center px-4 py-2 bg-[#013220] text-white rounded-lg hover:bg-[#014a2d] transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit an Event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#C5A059] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#013220] text-lg">{event.title}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            event.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {event.status === 'published' ? 'Published' : 'Pending Review'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-[#C5A059]" />
                          {new Date(event.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-[#C5A059]" />
                          {event.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-[#C5A059]" />
                          {event.location}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/account/edit-event/${event.id}`}
                        className="flex items-center px-4 py-2 bg-[#013220] text-white rounded-lg hover:bg-[#014a2d] transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
