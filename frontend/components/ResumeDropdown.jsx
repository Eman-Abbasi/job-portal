'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function ResumeDropdown({ onClose }) {
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    onClose();
    router.push(href);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg z-50"
    >
      <div className="py-2">
        <Link
          href="/profile?tab=resume"
          onClick={(e) => handleLinkClick(e, '/profile?tab=resume')}
          className="block px-4 py-2 text-dark-text-muted hover:bg-dark-surface hover:text-white transition-colors"
        >
          Review Resume
        </Link>
        <Link
          href="/profile?tab=resume"
          onClick={(e) => handleLinkClick(e, '/profile?tab=resume')}
          className="block px-4 py-2 text-dark-text-muted hover:bg-dark-surface hover:text-white transition-colors"
        >
          Resume Builder
        </Link>
      </div>
    </div>
  );
}
