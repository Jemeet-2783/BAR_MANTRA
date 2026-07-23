/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className = '', size }: DynamicIconProps) {
  // Map the string name to the actual Lucide component
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback to a default Sparkles icon if not found
    return <Icons.Sparkles className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
