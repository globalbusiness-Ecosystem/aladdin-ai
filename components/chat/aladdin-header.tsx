'use client';

import { useState, useEffect } from 'react';

export function AladdinHeader({ isCollapsed }: { isCollapsed: boolean }) {
  const [isVisible, setIsVisible] = useState(!isCollapsed);

  useEffect(() => {
    setIsVisible(!isCollapsed);
  }, [isCollapsed]);

  // Header is hidden when messages are present
  return null;
}
