/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TEAM } from '../data';
import { X, Sparkles, Award } from 'lucide-react';
import { TeamMember } from '../types';
import { getResponsiveImageUrl } from '../utils/cloudinary';
import { useSiteContent } from '../useSiteContent';

export function TeamSection() {
  const { team } = useSiteContent();
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);

  const teamList = team && team.length > 0 ? team : TEAM;

  return (
    <section id="team-section" className="relative py-24 bg-ivory-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 mb-2 block">
            The Visionaries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight mb-4">
            Architects of <span className="italic text-maroon-700">Royal Grandeur</span>
          </h2>
          <div className="w-24 h-[1px] bg-gold-600 mx-auto my-4" />
          <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            Meet Barmantra\'s creative leadership team. Combining design pedigree from premier institutes with decades of event production experience.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamList.map((member) => (
            <div
              key={member.id}
              onClick={() => setActiveMember(member)}
              className="group relative bg-ivory-100 rounded-2xl overflow-hidden border border-gold-600/10 hover:border-gold-500 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={getResponsiveImageUrl(member.image, 400)}
                  alt={member.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=600&q=80';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
              </div>

              {/* Title Content */}
              <div className="p-5 text-center bg-ivory-50 group-hover:bg-ivory-100 transition-colors">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-maroon-950 group-hover:text-maroon-700 transition-colors">
                  {member.name}
                </h3>
                <p className="font-sans text-xs uppercase tracking-wider text-gray-500 mt-1 font-mono">
                  {member.role}
                </p>
                <div className="mt-3.5 inline-flex items-center text-xs font-mono font-bold text-maroon-900 group-hover:text-gold-700 transition-colors">
                  <span>View Story & Bio</span>
                  <span className="ml-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* EXPANDED PROFILE DRAWER / MODAL */}
      {activeMember && (
        <div
          className="fixed inset-0 z-100 bg-maroon-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveMember(null)}
        >
          <div
            className="relative bg-ivory-50 rounded-3xl overflow-hidden border border-gold-500/30 max-w-2xl w-full shadow-2xl flex flex-col md:flex-row animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveMember(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-maroon-950 text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
              aria-label="Close bio"
            >
              <X size={18} />
            </button>

            {/* Profile Left: Image */}
            <div className="md:w-5/12 h-64 md:h-auto relative">
              <img
                src={activeMember.image}
                alt={activeMember.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=600&q=80';
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/40 to-transparent" />
            </div>

            {/* Profile Right: Description text */}
            <div className="md:w-7/12 p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-gold-700 font-mono text-[10px] uppercase tracking-widest mb-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Barmantra Leadership</span>
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl text-maroon-950 font-medium">
                {activeMember.name}
              </h3>
              
              <p className="font-mono text-xs uppercase tracking-wider text-gold-700 mt-1 pb-4 border-b border-gold-600/10">
                {activeMember.role}
              </p>

              <p className="font-sans text-sm text-gray-700 leading-relaxed font-light mt-4">
                {activeMember.bio}
              </p>

              <div className="mt-6 pt-4 border-t border-gold-600/10 flex items-center space-x-3 text-xs text-gray-400">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>Jaipur, Rajasthan Studio</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
