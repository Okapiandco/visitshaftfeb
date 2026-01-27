'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, Calendar, MapPin, Users, Plus, ArrowLeft, Clock, Check, X, Eye, LogOut, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { UserProfile, ShaftesburyEvent, Landmark } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingEvents, setPendingEvents] = useState<ShaftesburyEvent[]>([]);
  const [allEvents, setAllEvents] = useState<ShaftesburyEvent[]>([]);
  const [allLandmarks, setAllLandmarks] = useState<Landmark[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingLandmarks, setLoadingLandmarks] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'landmarks'>('pending');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch the user's profile to check admin status
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.is_admin) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            is_admin: profile.is_admin,
            full_name: profile.full_name || session.user.user_metadata?.full_name,
          });
          fetchPendingEvents();
          fetchAllEvents();
          fetchAllLandmarks();
        } else {
          // Not an admin, redirect
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchPendingEvents = async () => {
    setLoadingEvents(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingEvents(data || []);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllEvents(data || []);
    } catch (error) {
      console.error('Error fetching all events:', error);
    }
  };

  const fetchAllLandmarks = async () => {
    setLoadingLandmarks(true);
    try {
      const { data, error } = await supabase
        .from('landmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllLandmarks(data || []);
    } catch (error) {
      console.error('Error fetching landmarks:', error);
    } finally {
      setLoadingLandmarks(false);
    }
  };

  const approveEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', eventId);

      if (error) throw error;
      fetchPendingEvents();
      fetchAllEvents();
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const rejectEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to reject this event? This action cannot be undone.')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      fetchPendingEvents();
      fetchAllEvents();
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  const unpublishEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'pending' })
        .eq('id', eventId);

      if (error) throw error;
      fetchPendingEvents();
      fetchAllEvents();
    } catch (error) {
      console.error('Error unpublishing event:', error);
    }
  };

  const publishLandmark = async (landmarkId: string) => {
    try {
      const { error } = await supabase
        .from('landmarks')
        .update({ status: 'published' })
        .eq('id', landmarkId);

      if (error) throw error;
      fetchAllLandmarks();
    } catch (error) {
      console.error('Error publishing landmark:', error);
    }
  };

  const unpublishLandmark = async (landmarkId: string) => {
    try {
      const { error } = await supabase
        .from('landmarks')
        .update({ status: 'pending' })
        .eq('id', landmarkId);

      if (error) throw error;
      fetchAllLandmarks();
    } catch (error) {
      console.error('Error unpublishing landmark:', error);
    }
  };

  const deleteLandmark = async (landmarkId: string) => {
    if (!confirm('Are you sure you want to delete this landmark? This action cannot be undone.')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('landmarks')
        .delete()
        .eq('id', landmarkId);

      if (error) throw error;
      fetchAllLandmarks();
    } catch (error) {
      console.error('Error deleting landmark:', error);
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#013220] mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You must be an administrator to access this page.
            </p>
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-[#013220] text-white font-semibold rounded-lg hover:bg-[#014a2d] transition-colors"
              >
                Sign In as Admin
              </Link>
              <Link
                href="/"
                className="block w-full py-3 px-4 border-2 border-[#013220] text-[#013220] font-semibold rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Pending Events', value: pendingEvents.length.toString(), icon: Clock },
    { label: 'Published Events', value: allEvents.filter(e => e.status === 'published').length.toString(), icon: Check },
    { label: 'Total Events', value: allEvents.length.toString(), icon: Calendar },
    { label: 'Published Landmarks', value: allLandmarks.filter(l => l.status === 'published').length.toString(), icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Header */}
      <div className="bg-[#013220] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website
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
            <Settings className="h-8 w-8 text-[#C5A059] mr-3" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-300">Welcome, {user.full_name || user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#013220] mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-[#F9F7F2] rounded-full flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-[#C5A059]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pending'
                    ? 'border-[#C5A059] text-[#013220]'
                    : 'border-transparent text-gray-500 hover:text-[#013220]'
                }`}
              >
                Pending Events ({pendingEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'all'
                    ? 'border-[#C5A059] text-[#013220]'
                    : 'border-transparent text-gray-500 hover:text-[#013220]'
                }`}
              >
                All Events ({allEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('landmarks')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'landmarks'
                    ? 'border-[#C5A059] text-[#013220]'
                    : 'border-transparent text-gray-500 hover:text-[#013220]'
                }`}
              >
                Landmarks ({allLandmarks.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#013220]">Pending Event Submissions</h2>
                  <button
                    onClick={fetchPendingEvents}
                    className="text-sm text-[#013220] hover:text-[#C5A059] transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {loadingEvents ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-[#013220] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading events...</p>
                  </div>
                ) : pendingEvents.length === 0 ? (
                  <div className="text-center py-8 bg-[#F9F7F2] rounded-lg">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No pending events</p>
                    <p className="text-sm text-gray-500 mt-1">
                      New event submissions will appear here for review.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onApprove={() => approveEvent(event.id)}
                        onReject={() => rejectEvent(event.id)}
                        showApprove
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'all' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#013220]">All Events</h2>
                  <button
                    onClick={fetchAllEvents}
                    className="text-sm text-[#013220] hover:text-[#C5A059] transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {allEvents.length === 0 ? (
                  <div className="text-center py-8 bg-[#F9F7F2] rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No events yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onApprove={() => approveEvent(event.id)}
                        onReject={() => rejectEvent(event.id)}
                        onUnpublish={() => unpublishEvent(event.id)}
                        showApprove={event.status === 'pending'}
                        showUnpublish={event.status === 'published'}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'landmarks' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#013220]">All Landmarks</h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={fetchAllLandmarks}
                      className="text-sm text-[#013220] hover:text-[#C5A059] transition-colors"
                    >
                      Refresh
                    </button>
                    <Link
                      href="/admin/add-landmark"
                      className="inline-flex items-center px-4 py-2 bg-[#013220] text-white text-sm rounded-lg hover:bg-[#014a2d] transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Landmark
                    </Link>
                  </div>
                </div>

                {loadingLandmarks ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-[#013220] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading landmarks...</p>
                  </div>
                ) : allLandmarks.length === 0 ? (
                  <div className="text-center py-8 bg-[#F9F7F2] rounded-lg">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No landmarks yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Add landmarks to showcase local attractions.
                    </p>
                    <Link
                      href="/admin/add-landmark"
                      className="inline-flex items-center mt-4 px-4 py-2 bg-[#C5A059] text-[#013220] rounded-lg hover:bg-[#d4af6a] transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Your First Landmark
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allLandmarks.map((landmark) => (
                      <LandmarkCard
                        key={landmark.id}
                        landmark={landmark}
                        onPublish={() => publishLandmark(landmark.id)}
                        onUnpublish={() => unpublishLandmark(landmark.id)}
                        onDelete={() => deleteLandmark(landmark.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-[#013220] mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/submit-event"
              className="flex items-center justify-center p-4 bg-[#013220] text-white rounded-lg hover:bg-[#014a2d] transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Event
            </Link>
            <Link
              href="/admin/add-landmark"
              className="flex items-center justify-center p-4 bg-[#C5A059] text-[#013220] rounded-lg hover:bg-[#d4af6a] transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Landmark
            </Link>
            <Link
              href="/events"
              className="flex items-center justify-center p-4 border-2 border-[#013220] text-[#013220] rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
            >
              <Eye className="h-5 w-5 mr-2" />
              View Public Events
            </Link>
            <Link
              href="/landmarks"
              className="flex items-center justify-center p-4 border-2 border-[#013220] text-[#013220] rounded-lg hover:bg-[#013220] hover:text-white transition-colors"
            >
              <MapPin className="h-5 w-5 mr-2" />
              View Landmarks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({
  event,
  onApprove,
  onReject,
  onUnpublish,
  showApprove = false,
  showUnpublish = false,
}: {
  event: ShaftesburyEvent;
  onApprove: () => void;
  onReject: () => void;
  onUnpublish?: () => void;
  showApprove?: boolean;
  showUnpublish?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-[#C5A059] transition-colors">
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
              {event.status}
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
          {showApprove && (
            <button
              onClick={onApprove}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Approve"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </button>
          )}
          {showUnpublish && onUnpublish && (
            <button
              onClick={onUnpublish}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              title="Unpublish"
            >
              <Clock className="h-4 w-4 mr-1" />
              Unpublish
            </button>
          )}
          <button
            onClick={onReject}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Delete"
          >
            <X className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function LandmarkCard({
  landmark,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  landmark: Landmark;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-[#C5A059] transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#013220] text-lg">{landmark.name}</h3>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                landmark.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {landmark.status}
            </span>
            {landmark.type && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#F9F7F2] text-[#013220]">
                {landmark.type}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
            {landmark.distance && (
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-[#C5A059]" />
                {landmark.distance}
              </span>
            )}
            {landmark.lat && landmark.lng && (
              <span className="flex items-center text-gray-400">
                {landmark.lat.toFixed(4)}, {landmark.lng.toFixed(4)}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2 line-clamp-2">{landmark.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {landmark.status === 'pending' && (
            <button
              onClick={onPublish}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Publish"
            >
              <Check className="h-4 w-4 mr-1" />
              Publish
            </button>
          )}
          {landmark.status === 'published' && (
            <button
              onClick={onUnpublish}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              title="Unpublish"
            >
              <Clock className="h-4 w-4 mr-1" />
              Unpublish
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Delete"
          >
            <X className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
