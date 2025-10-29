'use client';

import { useEffect } from 'react';

export default function DatabaseInit() {
  useEffect(() => {
    // Check database connection on component mount
    fetch('/api/health')
      .catch(error => {
        console.error('[Database] Health check failed:', error);
      });
  }, []);

  return null; // This component doesn't render anything
}