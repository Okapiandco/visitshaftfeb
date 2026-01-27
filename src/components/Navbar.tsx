'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, MapPin, Calendar, Car, History, Utensils, Bed, User, Plus, LogOut, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(profile?.is_admin || false);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setIsOpen(false);
  };

  const navLinks = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/landmarks', label: 'Explore', icon: MapPin },
    { href: '/dining', label: 'Dining', icon: Utensils },
    { href: '/accommodation', label: 'Stay', icon: Bed },
    { href: '/transport', label: 'Transport', icon: Car },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <nav className="bg-[#013220] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-[#C5A059]" />
            <span className="text-xl font-bold">Visit Shaftesbury</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#014a2d] transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            <Link
              href="/submit-event"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-[#C5A059] text-[#013220] hover:bg-[#d4af6a] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Submit Event</span>
            </Link>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#014a2d] transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <Link
                      href="/account"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium border border-white/30 hover:bg-white/10 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#014a2d] transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium border border-white/30 hover:bg-white/10 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#014a2d] transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#014a2d]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-[#013220] transition-colors"
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            <Link
              href="/submit-event"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-[#C5A059] text-[#013220] hover:bg-[#d4af6a] transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Submit Event</span>
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-[#013220] transition-colors"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium border border-white/30 hover:bg-white/10 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Account</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-[#013220] transition-colors w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium border border-white/30 hover:bg-white/10 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
