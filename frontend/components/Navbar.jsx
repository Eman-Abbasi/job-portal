'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, removeToken, setUser } from '../lib/auth';
import { authAPI } from '../lib/api';
import ResumeDropdown from './ResumeDropdown';

export default function Navbar() {
  const [user, setUserState] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = getUser();
    setUserState(currentUser);
    
    // Fetch fresh user data if token exists
    if (currentUser) {
      authAPI.getMe()
        .then(res => {
          setUser(res.data.user);
          setUserState(res.data.user);
        })
        .catch(() => {
          removeToken();
          setUserState(null);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setUserState(null);
      router.push('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/jobs');
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-dark-surface border-b border-dark-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">JobPortal</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2 pl-10 text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-dark-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className={`hidden md:block ${isActive('/') ? 'text-blue-500' : 'text-dark-text-muted hover:text-white'}`}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className={`hidden md:block ${isActive('/jobs') ? 'text-blue-500' : 'text-dark-text-muted hover:text-white'}`}
            >
              Jobs
            </Link>
            
            {/* Resume Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
                className={`${isActive('/profile') ? 'text-blue-500' : 'text-dark-text-muted hover:text-white'}`}
              >
                Resume
              </button>
              {isResumeDropdownOpen && (
                <ResumeDropdown onClose={() => setIsResumeDropdownOpen(false)} />
              )}
            </div>

            <Link
              href="/head-hunter"
              className={`hidden md:block ${isActive('/head-hunter') ? 'text-blue-500' : 'text-dark-text-muted hover:text-white'}`}
            >
              Head Hunter
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-dark-text-muted hover:text-white"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-dark-text-muted hover:text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-dark-card hover:bg-dark-border border border-dark-border px-4 py-2 rounded-lg text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-dark-text-muted hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2 pl-10 text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-dark-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
        </div>
      </div>
    </nav>
  );
}
