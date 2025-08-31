"use client";

import { sendEvent } from '@/lib/gtagHelper';
import Link from 'next/link';

interface TrackedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  // We'll use these props to define our GA event
  eventAction: string;
  eventCategory: string;
  eventLabel: string;
}

export default function TrackedLink({
  href,
  children,
  className = '',
  eventAction,
  eventCategory,
  eventLabel
}: TrackedLinkProps) {
  
  const handleClick = () => {
    sendEvent(eventAction, eventCategory, eventLabel);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
}