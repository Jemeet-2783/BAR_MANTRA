/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BarmantraLogoProps {
  className?: string;
  iconSize?: number;
  textColor?: 'gold' | 'white' | 'mixed';
  hideText?: boolean;
  subtitleSize?: 'xs' | 'sm' | 'default';
}

export function BarmantraLogo({
  className = '',
  iconSize = 48,
  textColor = 'mixed',
  hideText = false,
  subtitleSize = 'default'
}: BarmantraLogoProps) {
  // Let's unique-ify the clip-path ID in case of multiple logos on the page
  const clipId = React.useId().replace(/:/g, '-');

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Icon portion (Martini Glass with Red Wave) */}
      <div 
        style={{ width: iconSize, height: iconSize }}
        className="flex-shrink-0 flex items-center justify-center bg-transparent"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Clip path to match the inside of the martini bowl */}
          <defs>
            <clipPath id={`glass-inner-${clipId}`}>
              <polygon points="18,15 82,15 50,57" />
            </clipPath>
          </defs>

          {/* Liquid (Clipped to Martini Bowl) */}
          <path
            d="M 10,34 C 30,26 40,42 60,34 C 80,26 90,38 100,34 L 100,65 L 0,65 Z"
            fill="#D20000"
            clipPath={`url(#glass-inner-${clipId})`}
          />

          {/* Martini Glass Outer Outline */}
          <polygon
            points="15,15 85,15 50,58"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Stem & Base */}
          <path
            d="M 50,58 L 50,86"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 30,86 L 70,86"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography portion */}
      {!hideText && (
        <div className="flex flex-col select-none">
          <div className="flex items-baseline font-serif tracking-normal leading-none font-bold text-lg sm:text-xl lg:text-2xl">
            {textColor === 'mixed' ? (
              <>
                <span className="text-[#D20000] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">B</span>
                <span className="text-white font-medium">AR</span>
                <span className="text-[#D20000] ml-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">M</span>
                <span className="text-white font-medium">ANTRA</span>
              </>
            ) : textColor === 'gold' ? (
              <span className="text-gold-500 font-semibold">BARMANTRA</span>
            ) : (
              <span className="text-white font-semibold">BARMANTRA</span>
            )}
          </div>
          <span 
            className={`font-sans tracking-widest uppercase text-white font-semibold opacity-90 mt-1 block ${
              subtitleSize === 'xs' 
                ? 'text-[7px]' 
                : subtitleSize === 'sm' 
                  ? 'text-[8px]' 
                  : 'text-[9px] sm:text-[10px]'
            }`}
          >
            A Complete Bar & Event Solutions
          </span>
        </div>
      )}
    </div>
  );
}
