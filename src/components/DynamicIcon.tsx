/**
 * Barmantra — Optimized Dynamic Lucide Icon Component
 */

import React from 'react';
import {
  Heart,
  Briefcase,
  GlassWater,
  Layers,
  Sparkles,
  Wine,
  PhoneCall,
  Compass,
  Zap,
  CheckCircle,
  CheckCircle2,
  Award,
  ShieldCheck,
  Users,
  Calendar,
  Clock,
  Flame,
  Star,
  Crown,
  Palette,
  Utensils,
  Feather,
  Building,
  Building2,
  Phone,
  Mail,
  Lock,
  Shield,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Search,
  Printer,
  Download,
  Receipt,
  ExternalLink,
  Eye,
  UserPlus,
  Menu,
  X,
  Instagram,
  Facebook,
  MessageSquare,
  MapPin,
  HelpCircle,
  Scale,
  FileSignature,
  AlertCircle
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

// Optimized dictionary map of supported icons for maximum tree-shaking performance
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Heart,
  Briefcase,
  GlassWater,
  Layers,
  Sparkles,
  Wine,
  PhoneCall,
  Compass,
  Zap,
  CheckCircle,
  CheckCircle2,
  Award,
  ShieldCheck,
  Users,
  Calendar,
  Clock,
  Flame,
  Star,
  Crown,
  Palette,
  Utensils,
  Feather,
  Building,
  Building2,
  Phone,
  Mail,
  Lock,
  Shield,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Search,
  Printer,
  Download,
  Receipt,
  ExternalLink,
  Eye,
  UserPlus,
  Menu,
  X,
  Instagram,
  Facebook,
  MessageSquare,
  MapPin,
  HelpCircle,
  Scale,
  FileSignature,
  AlertCircle
};

export function DynamicIcon({ name, className = '', size }: DynamicIconProps) {
  const IconComponent = ICON_MAP[name] || Sparkles;
  return <IconComponent className={className} size={size} />;
}
