'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { authAPI } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authAPI.forgotPassword({ email });
      setMessage('If an account exists with this email, you will receive password reset instructions.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-dark-card border border-dark-border rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Forgot Password</h1>
            <p className="text-dark-text-muted mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-text-muted mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link
                href="/login"
                className="text-sm text-blue-500 hover:text-blue-400 transition-colors block"
              >
                ← Back to Login
              </Link>
              <p className="text-sm text-dark-text-muted">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-500 hover:text-blue-400">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
