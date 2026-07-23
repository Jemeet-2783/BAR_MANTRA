/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SEO } from '../SEO';
import { 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  IndianRupee, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  Trash2, 
  Check, 
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Clock,
  RotateCcw,
  UserCheck,
  History,
  Archive,
  Edit3,
  Sliders,
  Plus,
  Key,
  UserPlus,
  Settings,
  Image as ImageIcon,
  Sparkles,
  Globe,
  Save
} from 'lucide-react';
import { useHashRoute } from '../../useHashRoute';
import { DbBooking, DbContact } from '../../server/db';
import { useSiteContent } from '../../useSiteContent';

export function AdminView() {
  const { navigateTo } = useHashRoute();
  const { siteSettings, heroSlides, services, portfolioItems, team, testimonials, faqs, refreshContent } = useSiteContent();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [email, setEmail] = useState('admin@barmantra.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Dashboard states - 12 Persistent Sidebar Sections
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'proposals'
    | 'inquiries'
    | 'trash'
    | 'audit'
    | 'services'
    | 'portfolio'
    | 'testimonials'
    | 'faqs'
    | 'pricing'
    | 'content'
    | 'users'
  >('dashboard');

  const [activeCmsSubTab, setActiveCmsSubTab] = useState<'branding' | 'services' | 'portfolio' | 'team' | 'testimonials' | 'faqs'>('branding');

  // Dynamic Pricing Engine State
  const [pricingRulesData, setPricingRulesData] = useState<any>({
    setupFee: 25000,
    eventTypes: [
      { eventType: 'wedding-bar', name: 'Royal Wedding Bar Curation', basePrice: 25000, perGuestRate: 2500 },
      { eventType: 'corporate-bar', name: 'Corporate Lounges & Brand Bars', basePrice: 25000, perGuestRate: 1800 },
      { eventType: 'private-bar', name: 'Boutique Private Soirée Bar', basePrice: 25000, perGuestRate: 1500 },
      { eventType: 'flair-bar', name: 'Interactive Flair Bar Show', basePrice: 25000, perGuestRate: 2000 },
      { eventType: 'masterclass', name: 'Private Cocktail Masterclass', basePrice: 20000, perGuestRate: 1200 }
    ]
  });

  // Confirmation Modal State (Safety & UX Detail 16)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Force Password Reset Modal State for Superadmin
  const [forceResetModal, setForceResetModal] = useState<{
    isOpen: boolean;
    userId: string;
    userEmail: string;
    newPassword: string;
  }>({
    isOpen: false,
    userId: '',
    userEmail: '',
    newPassword: ''
  });

  // CMS Editor States
  const [cmsBranding, setCmsBranding] = useState<any>(siteSettings);
  const [cmsSlides, setCmsSlides] = useState<any[]>(heroSlides);
  const [cmsServicesList, setCmsServicesList] = useState<any[]>(services);
  const [cmsPortfolioList, setCmsPortfolioList] = useState<any[]>(portfolioItems);
  const [cmsTeamList, setCmsTeamList] = useState<any[]>(team);
  const [cmsTestimonialsList, setCmsTestimonialsList] = useState<any[]>(testimonials);
  const [cmsFaqsList, setCmsFaqsList] = useState<any[]>(faqs);

  // Sync CMS state when useSiteContent context finishes fetching
  useEffect(() => {
    if (siteSettings) setCmsBranding(siteSettings);
    if (heroSlides) setCmsSlides(heroSlides);
    if (services) setCmsServicesList(services);
    if (portfolioItems) setCmsPortfolioList(portfolioItems);
    if (team) setCmsTeamList(team);
    if (testimonials) setCmsTestimonialsList(testimonials);
    if (faqs) setCmsFaqsList(faqs);
  }, [siteSettings, heroSlides, services, portfolioItems, team, testimonials, faqs]);

  // Admin User Management State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'superadmin' | 'admin' | 'staff'>('staff');

  // Profile credentials state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profEmail, setProfEmail] = useState('');
  const [profName, setProfName] = useState('');
  const [profPassword, setProfPassword] = useState('');

  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [contacts, setContacts] = useState<DbContact[]>([]);
  const [trashItems, setTrashItems] = useState<{ bookings: DbBooking[]; contacts: DbContact[] }>({ bookings: [], contacts: [] });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [messageNotification, setMessageNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [csrfToken, setCsrfToken] = useState('');

  // Check auth on load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/admin/check-auth');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated && data.user) {
        if (data.csrfToken) setCsrfToken(data.csrfToken);
        setUserProfile(data.user);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to query auth status:', err);
      setIsAuthenticated(false);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const [bookingsRes, contactsRes, statsRes, trashRes, auditRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/contacts'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/trash'),
        fetch('/api/admin/audit-logs')
      ]);

      if (bookingsRes.ok && contactsRes.ok && statsRes.ok) {
        const bookingsData = await bookingsRes.json();
        const contactsData = await contactsRes.json();
        const statsData = await statsRes.json();
        const trashData = trashRes.ok ? await trashRes.json() : { bookings: [], contacts: [] };
        const auditData = auditRes.ok ? await auditRes.json() : [];

        setBookings(bookingsData);
        setContacts(contactsData);
        setStats(statsData);
        setTrashItems(trashData);
        setAuditLogs(auditData);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showNotification('Could not synchronize ledger with remote server.', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSaveCmsSection = async (section: string, payloadData: any) => {
    try {
      const res = await fetch(`/api/admin/site-content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify(payloadData)
      });
      const result = await res.json();
      if (res.ok) {
        showNotification(`Dynamic section '${section}' updated & published live!`, 'success');
        await refreshContent();
      } else {
        showNotification(result.error || 'Failed to save section', 'error');
      }
    } catch (err) {
      showNotification('Network error while saving CMS changes', 'error');
    }
  };

  const fetchPricingRules = async () => {
    try {
      const res = await fetch('/api/pricing/rules');
      if (res.ok) {
        const data = await res.json();
        setPricingRulesData(data);
      }
    } catch (err) {
      console.error('Failed to load pricing rules:', err);
    }
  };

  const handleSavePricingRules = async (newRules: any) => {
    try {
      const res = await fetch('/api/admin/pricing/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify(newRules)
      });
      const result = await res.json();
      if (res.ok) {
        setPricingRulesData(newRules);
        showNotification('Dynamic pricing rules updated & live server calculator updated!', 'success');
      } else {
        showNotification(result.error || 'Failed to update pricing rules', 'error');
      }
    } catch (err) {
      showNotification('Network error while updating pricing rules', 'error');
    }
  };

  const handlePurgeTrashItem = (type: 'booking' | 'contact', id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Permanent Database Purge Confirmation',
      message: `Are you strictly sure you want to PERMANENTLY PURGE the deleted ${type} record for '${name}'? This action cannot be undone.`,
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/trash/purge/${type}/${id}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-Token': csrfToken }
          });
          const data = await res.json();
          if (res.ok) {
            showNotification(`Record ${id} permanently purged from database.`, 'success');
            fetchDashboardData();
          } else {
            showNotification(data.error || 'Failed to purge record.', 'error');
          }
        } catch (err) {
          showNotification('Network error during purge operation.', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleDeactivateUser = (userId: string, userEmail: string, currentDeactivated: boolean) => {
    const nextState = !currentDeactivated;
    setConfirmModal({
      isOpen: true,
      title: `${nextState ? 'Deactivate' : 'Reactivate'} Admin Account`,
      message: nextState
        ? `Are you sure you want to DEACTIVATE '${userEmail}'? They will be immediately blocked from accessing the Royal Command Studio.`
        : `Are you sure you want to REACTIVATE '${userEmail}'?`,
      isDanger: nextState,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users/${userId}/deactivate`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({ isDeactivated: nextState })
          });
          const data = await res.json();
          if (res.ok) {
            showNotification(`Account ${userEmail} ${nextState ? 'deactivated' : 'reactivated'} successfully!`, 'success');
            fetchUsers();
          } else {
            showNotification(data.error || 'Operation failed', 'error');
          }
        } catch (err) {
          showNotification('Network error changing user activation state.', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleForcePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forceResetModal.newPassword || forceResetModal.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters long.', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${forceResetModal.userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ newPassword: forceResetModal.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Password for ${forceResetModal.userEmail} has been reset. Active sessions invalidated.`, 'success');
        setForceResetModal({ isOpen: false, userId: '', userEmail: '', newPassword: '' });
      } else {
        showNotification(data.error || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showNotification('Network error during password reset.', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error('Failed to load users list:', err);
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regName) {
      showNotification('Please fill out all required user registration fields.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ email: regEmail, password: regPassword, name: regName, role: regRole })
      });
      const result = await res.json();
      if (res.ok) {
        showNotification('New admin account successfully registered!', 'success');
        setIsRegisterModalOpen(false);
        setRegEmail('');
        setRegPassword('');
        setRegName('');
        fetchUsers();
      } else {
        showNotification(result.error || 'Registration failed', 'error');
      }
    } catch (err) {
      showNotification('Error connecting to user registration server', 'error');
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    try {
      const res = await fetch(`/api/admin/users/${userProfile.id}/credentials`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ email: profEmail, name: profName, password: profPassword })
      });
      const result = await res.json();
      if (res.ok) {
        showNotification('Admin credentials updated successfully! Log in again if password changed.', 'success');
        setIsProfileModalOpen(false);
        checkAuthStatus();
      } else {
        showNotification(result.error || 'Failed to update credentials', 'error');
      }
    } catch (err) {
      showNotification('Network error while updating credentials', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError('Password is strictly required.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.csrfToken) setCsrfToken(data.csrfToken);
        setIsAuthenticated(true);
        setUserProfile(data.user);
        fetchDashboardData();
      } else {
        setLoginError(data.error || 'Invalid credentials or Royal Access Key.');
      }
    } catch (err) {
      setLoginError('Could not contact authentication bridge.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { 
        method: 'POST',
        headers: { 'X-CSRF-Token': csrfToken }
      });
      setIsAuthenticated(false);
      setUserProfile(null);
      setPassword('');
      setCsrfToken('');
    } catch (err) {
      console.error('Logout request failed:', err);
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showNotification(`Proposal ${id} updated to ${newStatus}.`, 'success');
        fetchDashboardData();
      } else {
        const err = await res.json();
        showNotification(err.error || 'Failed to update status.', 'error');
      }
    } catch (err) {
      showNotification('Network transmission failed.', 'error');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Move this event proposal to trash? You can restore it anytime from Recently Deleted.')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-Token': csrfToken }
      });
      if (res.ok) {
        showNotification(`Proposal ${id} soft-deleted to trash.`, 'success');
        fetchDashboardData();
      } else {
        showNotification('Failed to soft delete proposal.', 'error');
      }
    } catch (err) {
      showNotification('Network transmission failed.', 'error');
    }
  };

  const handleRestoreBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/restore`, {
        method: 'POST',
        headers: { 'X-CSRF-Token': csrfToken }
      });
      if (res.ok) {
        showNotification(`Proposal ${id} restored to active ledger!`, 'success');
        fetchDashboardData();
      } else {
        showNotification('Failed to restore proposal.', 'error');
      }
    } catch (err) {
      showNotification('Network transmission failed.', 'error');
    }
  };

  const updateContactStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showNotification(`Inquiry status updated to ${newStatus}.`, 'success');
        fetchDashboardData();
      } else {
        showNotification('Failed to update inquiry status.', 'error');
      }
    } catch (err) {
      showNotification('Network transmission failed.', 'error');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Move this contact inquiry to trash? You can restore it anytime.')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-Token': csrfToken }
      });
      if (res.ok) {
        showNotification('Inquiry soft-deleted to trash.', 'success');
        fetchDashboardData();
      } else {
        showNotification('Failed to soft-delete inquiry.', 'error');
      }
    } catch (err) {
      showNotification('Network transmission failed.', 'error');
    }
  };

  const handleRestoreContact = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}/restore`, {
        method: 'POST',
        headers: { 'X-CSRF-Token': csrfToken }
      });
      if (res.ok) {
        showNotification('Inquiry restored to active ledger!', 'success');
        fetchDashboardData();
      } else {
        showNotification('Failed to restore inquiry.', 'error');
      }
    } catch (err) {
      showNotification('Network transmission failed.', 'error');
    }
  };

  const showNotification = (text: string, type: 'success' | 'error') => {
    setMessageNotification({ text, type });
    setTimeout(() => setMessageNotification(null), 4000);
  };

  // Currency formatting helper
  const formatRupee = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Filtering lists
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="pt-32 pb-24 text-center max-w-md mx-auto">
        <RefreshCw className="w-8 h-8 text-gold-600 animate-spin mx-auto mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-maroon-900">
          Decrypting Command Studio...
        </p>
      </div>
    );
  }

  // --- LOGIN PANEL VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 max-w-md mx-auto px-4">
        <SEO
          title="Command Studio Login | Barmantra Admin"
          description="Barmantra Royal Command Studio Admin Access"
          noindex={true}
        />
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gold-600/15 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-maroon-950 via-gold-500 to-maroon-950" />
          
          <div className="w-14 h-14 bg-maroon-950 rounded-2xl flex items-center justify-center text-gold-400 mx-auto mb-6 border border-gold-500/20">
            <Lock size={26} />
          </div>

          <h1 className="font-serif text-2xl text-maroon-950 font-medium text-center mb-1">
            Command Ledger Access
          </h1>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gold-700 text-center mb-8">
            Barmantra Studio Control Platform
          </p>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start space-x-2.5 text-red-700 text-xs font-sans animate-shake">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1 font-bold">
                Admin Email Account *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barmantra.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1 font-bold">
                Royal Password Key *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-sans font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 border border-gold-500/20 mt-2"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Verify Credentials</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[11px] font-mono text-amber-900 text-center">
            Default Login: <span className="font-bold">admin@barmantra.com</span> / <span className="font-bold">barmantra123</span>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => navigateTo('#/')}
              className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-maroon-900 transition-colors cursor-pointer"
            >
              ← Cancel & Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SECURED DASHBOARD VIEW ---
  return (
    <div className="pt-24 pb-20 bg-ivory-50/50 min-h-screen">
      
      {/* Header bar */}
      <section className="bg-maroon-950 text-ivory-50 border-b border-gold-500/10 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-gold-400 uppercase font-bold">
                Barmantra Ledger Secure Control
              </span>
            </div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-white flex items-center gap-3">
              Executive Dashboard
            </h1>
            {userProfile && (
              <div className="mt-2 flex items-center space-x-2 text-xs font-mono text-gold-200/80">
                <UserCheck size={14} className="text-gold-400" />
                <span>Logged in as: <strong className="text-white">{userProfile.name}</strong> ({userProfile.email})</span>
                <span className="px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 uppercase text-[9px]">
                  {userProfile.role}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDashboardData}
              disabled={isLoadingData}
              className="px-4 py-2 rounded-xl border border-gold-500/20 text-xs font-mono uppercase tracking-wider hover:bg-maroon-900 transition-colors flex items-center space-x-2 text-gold-400 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
              <span>Sync Server</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-500/20 text-xs font-mono uppercase tracking-wider text-red-200 transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Lock Terminal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Floating alert */}
      {messageNotification && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center space-x-3 text-sm font-sans max-w-sm animate-scale-in ${
          messageNotification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {messageNotification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{messageNotification.text}</span>
        </div>
      )}

      {/* BENTO STATISTICS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* STAT 1: Projected Revenue */}
          <div className="bg-white p-6 rounded-2xl border border-gold-600/10 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Projected Revenue Pipeline</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <IndianRupee size={16} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-maroon-950">
                {stats ? formatRupee(stats.totalRevenueEstimate) : '...'}
              </h2>
              <div className="flex items-center space-x-1 mt-1 text-[10px] text-emerald-600 font-sans font-medium">
                <TrendingUp size={12} />
                <span>Based on approved proposals</span>
              </div>
            </div>
          </div>

          {/* STAT 2: Total Proposals */}
          <div className="bg-white p-6 rounded-2xl border border-gold-600/10 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Total Proposals Submitted</span>
              <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center">
                <FileText size={16} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-maroon-950">
                {stats ? stats.totalProposals : '...'}
              </h2>
              <span className="text-[10px] text-gray-400 font-sans block mt-1">
                Luxury custom bar quotes
              </span>
            </div>
          </div>

          {/* STAT 3: Pending Action */}
          <div className="bg-white p-6 rounded-2xl border border-gold-600/10 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Pending Curation Quotes</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-maroon-950">
                {stats ? stats.pendingCount : '...'}
              </h2>
              <span className="text-[10px] text-amber-600 font-sans font-medium block mt-1">
                Action required within 4hrs
              </span>
            </div>
          </div>

          {/* STAT 4: Unread Inquiries */}
          <div className="bg-white p-6 rounded-2xl border border-gold-600/10 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Unread Callback Requests</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-maroon-950">
                {stats ? stats.unreadInquiries : '...'}
              </h2>
              <span className="text-[10px] text-blue-500 font-sans block mt-1">
                General client messages
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* PERSISTENT 12-SECTION SIDEBAR AND STUDIO WORKSPACE LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PERSISTENT SIDEBAR NAVIGATION (4 Cols) */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* CORE OPERATIONS */}
            <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-maroon-900 font-bold block mb-3 px-2">
                Core Operations
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab('dashboard'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <TrendingUp size={15} />
                  <span>Dashboard Overview</span>
                </button>

                <button
                  onClick={() => { setActiveTab('proposals'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'proposals'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText size={15} />
                    <span>Event Proposals</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-[10px]">
                    {bookings.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('inquiries'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'inquiries'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <MessageSquare size={15} />
                    <span>General Inquiries</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px]">
                    {contacts.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('trash'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'trash'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Archive size={15} />
                    <span>Trash Archive</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px]">
                    {trashItems.bookings.length + trashItems.contacts.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('audit'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                    activeTab === 'audit'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <History size={15} />
                  <span>Audit Log Ledger</span>
                </button>
              </nav>
            </div>

            {/* CONTENT MANAGEMENT */}
            <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-maroon-900 font-bold block mb-3 px-2">
                Content Management
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab('services'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                    activeTab === 'services'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <Sliders size={15} />
                  <span>Services Catalog</span>
                </button>

                <button
                  onClick={() => { setActiveTab('portfolio'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                    activeTab === 'portfolio'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <ImageIcon size={15} />
                  <span>Portfolio Showcase</span>
                </button>

                <button
                  onClick={() => { setActiveTab('testimonials'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                    activeTab === 'testimonials'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <Sparkles size={15} />
                  <span>Testimonials & Reviews</span>
                </button>

                <button
                  onClick={() => { setActiveTab('faqs'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                    activeTab === 'faqs'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <AlertCircle size={15} />
                  <span>FAQ Accordion</span>
                </button>

                <button
                  onClick={() => { setActiveTab('content'); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                    activeTab === 'content'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <Globe size={15} />
                  <span>About Page & Team</span>
                </button>
              </nav>
            </div>

            {/* SYSTEM & PRICING */}
            <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-maroon-900 font-bold block mb-3 px-2">
                System & Governance
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab('pricing'); fetchPricingRules(); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                    activeTab === 'pricing'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <IndianRupee size={15} />
                  <span>Pricing Rules Engine</span>
                </button>

                <button
                  onClick={() => { setActiveTab('users'); fetchUsers(); setStatusFilter('all'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-maroon-950 text-gold-400 shadow-md'
                      : 'text-gray-600 hover:bg-ivory-100 hover:text-maroon-950'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <UserPlus size={15} />
                    <span>Admin Users</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 uppercase text-[9px]">
                    Superadmin
                  </span>
                </button>
              </nav>
            </div>

          </aside>

          {/* MAIN STUDIO WORKSPACE AREA (9 Cols) */}
          <main className="lg:col-span-9 bg-white rounded-3xl border border-gold-600/10 shadow-md p-6 overflow-hidden">

            {/* Filter and Search Box */}
            {(activeTab === 'bookings' || activeTab === 'contacts') && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter by name/detail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:border-gold-600 focus:outline-none bg-ivory-50/30 w-full sm:w-60 transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-1.5">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-gold-600 focus:outline-none bg-ivory-50/30 cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    {activeTab === 'bookings' ? (
                      <>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Cancelled">Cancelled</option>
                      </>
                    ) : (
                      <>
                        <option value="Unread">Unread</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </>
                    )}
                  </select>
                </div>

              </div>
            )}

          {/* Table Area */}
          <div className="overflow-x-auto">
            {activeTab === 'bookings' ? (
              // --- BOOKINGS TABLE ---
              filteredBookings.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-sans text-gray-500 font-light">No matching event proposals found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-ivory-50/80 border-b border-gray-100 text-maroon-950 font-mono text-[10px] uppercase tracking-wider font-bold">
                      <th className="py-4 px-6">Client Profile</th>
                      <th className="py-4 px-6">Event Details</th>
                      <th className="py-4 px-6">pricing Formula</th>
                      <th className="py-4 px-6">Curation Status</th>
                      <th className="py-4 px-6 text-right">Ledger Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-sans">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-ivory-50/30 transition-colors">
                        {/* Profile Info */}
                        <td className="py-5 px-6">
                          <div>
                            <span className="font-semibold text-gray-900 block">{b.name}</span>
                            <div className="flex flex-col space-y-1 mt-1.5 text-xs text-gray-500 font-light">
                              <a href={`tel:${b.phone}`} className="flex items-center space-x-1 hover:text-maroon-900">
                                <Phone size={11} />
                                <span>{b.phone}</span>
                              </a>
                              <a href={`mailto:${b.email}`} className="flex items-center space-x-1 hover:text-maroon-900">
                                <Mail size={11} />
                                <span>{b.email}</span>
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Event details */}
                        <td className="py-5 px-6 max-w-sm">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-gold-100 text-gold-900 text-[10px] font-mono uppercase tracking-wider mb-1 font-bold">
                              {b.eventType.replace('-', ' ')}
                            </span>
                            <div className="flex items-center space-x-3.5 text-xs text-gray-600 mb-1.5 mt-0.5">
                              <span className="flex items-center space-x-1 font-mono font-medium">
                                <Calendar size={12} className="text-gold-600" />
                                <span>{b.eventDate}</span>
                              </span>
                              <span className="flex items-center space-x-1 font-mono font-medium">
                                <Users size={12} className="text-gold-600" />
                                <span>{b.guestCount} Pax</span>
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-light line-clamp-3">
                              "{b.message}"
                            </p>
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="py-5 px-6 font-mono text-xs font-bold text-maroon-950">
                          {formatRupee(b.pricingEstimate)}
                        </td>

                        {/* Status */}
                        <td className="py-5 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                            b.status === 'Approved' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : b.status === 'Contacted'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : b.status === 'Cancelled'
                              ? 'bg-gray-100 text-gray-600 border border-gray-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          }`}>
                            {b.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Update dropdown */}
                            <select
                              value={b.status}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                              className="px-2 py-1.5 text-[10px] font-mono border border-gray-200 rounded-lg focus:outline-none focus:border-gold-600 bg-white cursor-pointer"
                            >
                              <option value="Pending">Set Pending</option>
                              <option value="Approved">Set Approved</option>
                              <option value="Contacted">Set Contacted</option>
                              <option value="Cancelled">Set Cancelled</option>
                            </select>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                              title="Delete proposal"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              // --- GENERAL CONTACTS TABLE ---
              filteredContacts.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-sans text-gray-500 font-light">No general inquiries found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-ivory-50/80 border-b border-gray-100 text-maroon-950 font-mono text-[10px] uppercase tracking-wider font-bold">
                      <th className="py-4 px-6">Inquirer</th>
                      <th className="py-4 px-6">Message / Specifications</th>
                      <th className="py-4 px-6">Ledger Date</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-sans">
                    {filteredContacts.map((c) => (
                      <tr key={c.id} className="hover:bg-ivory-50/30 transition-colors">
                        {/* Profile Info */}
                        <td className="py-5 px-6">
                          <div>
                            <span className="font-semibold text-gray-900 block">{c.name}</span>
                            <div className="flex flex-col space-y-1 mt-1.5 text-xs text-gray-500 font-light">
                              <a href={`tel:${c.phone}`} className="flex items-center space-x-1 hover:text-maroon-900">
                                <Phone size={11} />
                                <span>{c.phone}</span>
                              </a>
                              <a href={`mailto:${c.email}`} className="flex items-center space-x-1 hover:text-maroon-900">
                                <Mail size={11} />
                                <span>{c.email}</span>
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* message content */}
                        <td className="py-5 px-6 max-w-sm">
                          <div>
                            {c.eventType && (
                              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[9px] font-mono mb-1 font-bold">
                                Category: {c.eventType.replace('-', ' ')}
                              </span>
                            )}
                            <p className="text-xs text-gray-600 leading-relaxed font-light">
                              "{c.message}"
                            </p>
                          </div>
                        </td>

                        {/* timestamp */}
                        <td className="py-5 px-6 font-mono text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>

                        {/* Status */}
                        <td className="py-5 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                            c.status === 'Resolved' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : c.status === 'Contacted'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          }`}>
                            {c.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Update status select */}
                            <select
                              value={c.status}
                              onChange={(e) => updateContactStatus(c.id, e.target.value)}
                              className="px-2 py-1.5 text-[10px] font-mono border border-gray-200 rounded-lg focus:outline-none focus:border-gold-600 bg-white cursor-pointer"
                            >
                              <option value="Unread">Set Unread</option>
                              <option value="Contacted">Set Contacted</option>
                              <option value="Resolved">Set Resolved</option>
                            </select>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteContact(c.id)}
                              className="p-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                              title="Delete inquiry"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>

            {/* TRASH VIEW */}
            {activeTab === 'trash' && (
              <div className="p-6">
                <h3 className="font-serif text-lg font-medium text-maroon-950 mb-4 flex items-center gap-2">
                  <Archive className="text-gold-600" size={18} />
                  <span>Recently Soft-Deleted Records</span>
                </h3>
                {trashItems.bookings.length === 0 && trashItems.contacts.length === 0 ? (
                  <div className="text-center py-12 bg-ivory-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Trash2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-sans">Trash is empty. No deleted records pending recovery.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {trashItems.bookings.length > 0 && (
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-3 font-bold">Deleted Event Proposals</h4>
                        <div className="space-y-3">
                          {trashItems.bookings.map((tb) => (
                            <div key={tb.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-gray-900 text-sm">{tb.name} ({tb.eventType})</span>
                                <p className="text-xs text-gray-500 mt-0.5">Deleted on: {tb.deletedAt ? new Date(tb.deletedAt).toLocaleString() : 'N/A'} by {tb.deletedBy || 'Admin'}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleRestoreBooking(tb.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                                >
                                  <RotateCcw size={13} />
                                  <span>Restore</span>
                                </button>
                                {userProfile?.role === 'superadmin' && (
                                  <button
                                    onClick={() => handlePurgeTrashItem('booking', tb.id, tb.name)}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                                  >
                                    <Trash2 size={13} />
                                    <span>Purge Permanently</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {trashItems.contacts.length > 0 && (
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-3 font-bold">Deleted Inquiries</h4>
                        <div className="space-y-3">
                          {trashItems.contacts.map((tc) => (
                            <div key={tc.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-gray-900 text-sm">{tc.name} ({tc.email})</span>
                                <p className="text-xs text-gray-500 mt-0.5">Deleted on: {tc.deletedAt ? new Date(tc.deletedAt).toLocaleString() : 'N/A'} by {tc.deletedBy || 'Admin'}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleRestoreContact(tc.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                                >
                                  <RotateCcw size={13} />
                                  <span>Restore</span>
                                </button>
                                {userProfile?.role === 'superadmin' && (
                                  <button
                                    onClick={() => handlePurgeTrashItem('contact', tc.id, tc.name)}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                                  >
                                    <Trash2 size={13} />
                                    <span>Purge Permanently</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* AUDIT LOG VIEW */}
            {activeTab === 'audit' && (
              <div className="p-6">
                <h3 className="font-serif text-lg font-medium text-maroon-950 mb-4 flex items-center gap-2">
                  <History className="text-gold-600" size={18} />
                  <span>Real-Time Audit Ledger</span>
                </h3>
                {auditLogs.length === 0 ? (
                  <div className="text-center py-12 bg-ivory-50/50 rounded-2xl border border-dashed border-gray-200">
                    <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-sans">No audit events logged yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="py-3 px-2 flex items-start justify-between text-xs font-mono">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              log.action === 'SOFT_DELETE' ? 'bg-amber-100 text-amber-800' :
                              log.action === 'RESTORE' ? 'bg-emerald-100 text-emerald-800' :
                              log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800' :
                              log.action === 'STATUS_UPDATE' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {log.action}
                            </span>
                            <span className="font-semibold text-gray-900">{log.details}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-sans mt-1">
                            Actor: {log.actor ? `${log.actor.name} (${log.actor.email})` : 'System / Unauthenticated'}
                          </p>
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap pl-4">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DYNAMIC CMS PAGE EDITOR VIEW */}
            {activeTab === 'cms' && (
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-maroon-950 flex items-center gap-2">
                      <Edit3 className="text-gold-600" size={20} />
                      <span>Dynamic Studio CMS Editor</span>
                    </h3>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">
                      Update text, background slides, team bios, portfolio images, and site branding live on the public website.
                    </p>
                  </div>

                  {/* CMS Sub-tabs */}
                  <div className="flex flex-wrap gap-1.5 bg-ivory-100 p-1 rounded-xl border border-gray-200">
                    {(['branding', 'services', 'portfolio', 'team', 'testimonials', 'faqs'] as const).map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setActiveCmsSubTab(sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                          activeCmsSubTab === sub
                            ? 'bg-maroon-950 text-gold-400 shadow-sm'
                            : 'text-gray-600 hover:text-maroon-950'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Tab 1: Branding & Hero */}
                {activeCmsSubTab === 'branding' && (
                  <div className="space-y-6">
                    <div className="bg-ivory-50/60 p-5 rounded-2xl border border-gray-200 space-y-4">
                      <h4 className="font-serif text-base font-semibold text-maroon-950">Site Branding & Headlines</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Hero Main Headline</label>
                          <input
                            type="text"
                            value={cmsBranding?.heroHeadline || ''}
                            onChange={(e) => setCmsBranding({ ...cmsBranding, heroHeadline: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-gold-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Hero Badge Tagline</label>
                          <input
                            type="text"
                            value={cmsBranding?.tagline || ''}
                            onChange={(e) => setCmsBranding({ ...cmsBranding, tagline: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-gold-600 outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block font-bold text-gray-700 mb-1">Hero Subheadline</label>
                          <textarea
                            rows={2}
                            value={cmsBranding?.heroSubheadline || ''}
                            onChange={(e) => setCmsBranding({ ...cmsBranding, heroSubheadline: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-gold-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Concierge Phone Number</label>
                          <input
                            type="text"
                            value={cmsBranding?.phone || ''}
                            onChange={(e) => setCmsBranding({ ...cmsBranding, phone: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-gold-600 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Concierge Email</label>
                          <input
                            type="text"
                            value={cmsBranding?.email || ''}
                            onChange={(e) => setCmsBranding({ ...cmsBranding, email: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-gold-600 outline-none font-mono"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block font-bold text-gray-700 mb-1">Studio Address</label>
                          <input
                            type="text"
                            value={cmsBranding?.address || ''}
                            onChange={(e) => setCmsBranding({ ...cmsBranding, address: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-gold-600 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Background Slides list */}
                    <div className="bg-ivory-50/60 p-5 rounded-2xl border border-gray-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-base font-semibold text-maroon-950">Hero Background Slideshow</h4>
                        <button
                          onClick={() => setCmsSlides([...cmsSlides, { id: `hs-${Date.now()}`, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80', title: 'New Slide' }])}
                          className="px-3 py-1 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add Slide
                        </button>
                      </div>

                      <div className="space-y-3">
                        {cmsSlides.map((slide, idx) => (
                          <div key={slide.id || idx} className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 items-center">
                            <img src={slide.image} alt={slide.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow text-xs">
                              <input
                                type="text"
                                placeholder="Slide Title"
                                value={slide.title}
                                onChange={(e) => {
                                  const updated = [...cmsSlides];
                                  updated[idx].title = e.target.value;
                                  setCmsSlides(updated);
                                }}
                                className="p-2 rounded border border-gray-200 font-sans"
                              />
                              <input
                                type="text"
                                placeholder="Image URL (Unsplash or Cloudinary)"
                                value={slide.image}
                                onChange={(e) => {
                                  const updated = [...cmsSlides];
                                  updated[idx].image = e.target.value;
                                  setCmsSlides(updated);
                                }}
                                className="p-2 rounded border border-gray-200 font-mono text-[11px]"
                              />
                            </div>
                            <button
                              onClick={() => setCmsSlides(cmsSlides.filter((_, i) => i !== idx))}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete slide"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        await handleSaveCmsSection('siteSettings', cmsBranding);
                        await handleSaveCmsSection('heroSlides', cmsSlides);
                      }}
                      className="px-6 py-3 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save size={14} /> Publish Branding & Slides Live
                    </button>
                  </div>
                )}

                {/* Sub-Tab 2: Services */}
                {activeCmsSubTab === 'services' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-semibold text-maroon-950">Service Packages Catalog</h4>
                      <button
                        onClick={() => setCmsServicesList([...cmsServicesList, { slug: `service-${Date.now()}`, title: 'New Luxury Package', iconName: 'Sparkles', description: 'Package description...', longDescription: 'Detailed overview...', features: ['Feature 1', 'Feature 2'], images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'], timeline: [] }])}
                        className="px-3 py-1.5 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add New Package
                      </button>
                    </div>

                    <div className="space-y-4">
                      {cmsServicesList.map((srv, idx) => (
                        <div key={srv.slug || idx} className="p-4 bg-ivory-50/80 rounded-2xl border border-gray-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-gold-700 uppercase">Package #{idx + 1} ({srv.slug})</span>
                            <button
                              onClick={() => setCmsServicesList(cmsServicesList.filter((_, i) => i !== idx))}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer font-mono"
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">Package Title</label>
                              <input
                                type="text"
                                value={srv.title}
                                onChange={(e) => {
                                  const updated = [...cmsServicesList];
                                  updated[idx].title = e.target.value;
                                  setCmsServicesList(updated);
                                }}
                                className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">Short Description</label>
                              <input
                                type="text"
                                value={srv.description}
                                onChange={(e) => {
                                  const updated = [...cmsServicesList];
                                  updated[idx].description = e.target.value;
                                  setCmsServicesList(updated);
                                }}
                                className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSaveCmsSection('services', cmsServicesList)}
                      className="px-6 py-3 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save size={14} /> Publish Services Live
                    </button>
                  </div>
                )}

                {/* Sub-Tab 3: Portfolio */}
                {activeCmsSubTab === 'portfolio' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-semibold text-maroon-950">Portfolio Showcase Gallery</h4>
                      <button
                        onClick={() => setCmsPortfolioList([...cmsPortfolioList, { id: `port-${Date.now()}`, title: 'Palace Celebration', category: 'event-bars', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', location: 'Jaipur Palace', date: '2026', description: 'Royal mixology event...' }])}
                        className="px-3 py-1.5 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add Portfolio Item
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cmsPortfolioList.map((item, idx) => (
                        <div key={item.id || idx} className="p-4 bg-ivory-50/80 rounded-2xl border border-gray-200 space-y-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-gold-700 uppercase">Item #{idx + 1}</span>
                            <button
                              onClick={() => setCmsPortfolioList(cmsPortfolioList.filter((_, i) => i !== idx))}
                              className="text-red-600 hover:bg-red-50 p-1 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...cmsPortfolioList];
                                updated[idx].title = e.target.value;
                                setCmsPortfolioList(updated);
                              }}
                              className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">Category</label>
                              <select
                                value={item.category}
                                onChange={(e) => {
                                  const updated = [...cmsPortfolioList];
                                  updated[idx].category = e.target.value;
                                  setCmsPortfolioList(updated);
                                }}
                                className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                              >
                                <option value="cocktails">Cocktails</option>
                                <option value="event-bars">Event Bars</option>
                                <option value="guest-experiences">Guest Experiences</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={item.location}
                                onChange={(e) => {
                                  const updated = [...cmsPortfolioList];
                                  updated[idx].location = e.target.value;
                                  setCmsPortfolioList(updated);
                                }}
                                className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                            <input
                              type="text"
                              value={item.image}
                              onChange={(e) => {
                                const updated = [...cmsPortfolioList];
                                updated[idx].image = e.target.value;
                                setCmsPortfolioList(updated);
                              }}
                              className="w-full p-2 rounded-lg border border-gray-300 font-mono text-[11px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSaveCmsSection('portfolioItems', cmsPortfolioList)}
                      className="px-6 py-3 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save size={14} /> Publish Portfolio Live
                    </button>
                  </div>
                )}

                {/* Sub-Tab 4: Team */}
                {activeCmsSubTab === 'team' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-semibold text-maroon-950">Leadership & Team Members</h4>
                      <button
                        onClick={() => setCmsTeamList([...cmsTeamList, { id: `tm-${Date.now()}`, name: 'New Team Member', role: 'Senior Mixologist', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80', bio: 'Expert craft mixologist...' }])}
                        className="px-3 py-1.5 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add Team Member
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {cmsTeamList.map((tm, idx) => (
                        <div key={tm.id || idx} className="p-4 bg-ivory-50/80 rounded-2xl border border-gray-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-gold-700">Member #{idx + 1}</span>
                            <button
                              onClick={() => setCmsTeamList(cmsTeamList.filter((_, i) => i !== idx))}
                              className="text-red-600 hover:bg-red-50 p-1 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={tm.name}
                                onChange={(e) => {
                                  const updated = [...cmsTeamList];
                                  updated[idx].name = e.target.value;
                                  setCmsTeamList(updated);
                                }}
                                className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-gray-700 mb-1">Title / Role</label>
                              <input
                                type="text"
                                value={tm.role}
                                onChange={(e) => {
                                  const updated = [...cmsTeamList];
                                  updated[idx].role = e.target.value;
                                  setCmsTeamList(updated);
                                }}
                                className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Profile Photo URL</label>
                            <input
                              type="text"
                              value={tm.image}
                              onChange={(e) => {
                                const updated = [...cmsTeamList];
                                updated[idx].image = e.target.value;
                                setCmsTeamList(updated);
                              }}
                              className="w-full p-2 rounded-lg border border-gray-300 font-mono text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Bio Overview</label>
                            <textarea
                              rows={2}
                              value={tm.bio}
                              onChange={(e) => {
                                const updated = [...cmsTeamList];
                                updated[idx].bio = e.target.value;
                                setCmsTeamList(updated);
                              }}
                              className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSaveCmsSection('team', cmsTeamList)}
                      className="px-6 py-3 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save size={14} /> Publish Team Live
                    </button>
                  </div>
                )}

                {/* Sub-Tab 5: Testimonials */}
                {activeCmsSubTab === 'testimonials' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-semibold text-maroon-950">Client Reviews & Testimonials</h4>
                      <button
                        onClick={() => setCmsTestimonialsList([...cmsTestimonialsList, { id: `t-${Date.now()}`, name: 'Royal Client', eventType: 'Palace Wedding', rating: 5, quote: 'Immaculate cocktail curation...', date: 'July 2026' }])}
                        className="px-3 py-1.5 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add Testimonial
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      {cmsTestimonialsList.map((t, idx) => (
                        <div key={t.id || idx} className="p-4 bg-ivory-50/80 rounded-2xl border border-gray-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-gold-700">Review #{idx + 1}</span>
                            <button
                              onClick={() => setCmsTestimonialsList(cmsTestimonialsList.filter((_, i) => i !== idx))}
                              className="text-red-600 hover:bg-red-50 p-1 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Client Name"
                              value={t.name}
                              onChange={(e) => {
                                const updated = [...cmsTestimonialsList];
                                updated[idx].name = e.target.value;
                                setCmsTestimonialsList(updated);
                              }}
                              className="p-2 rounded border border-gray-300 font-sans"
                            />
                            <input
                              type="text"
                              placeholder="Event Type"
                              value={t.eventType}
                              onChange={(e) => {
                                const updated = [...cmsTestimonialsList];
                                updated[idx].eventType = e.target.value;
                                setCmsTestimonialsList(updated);
                              }}
                              className="p-2 rounded border border-gray-300 font-sans"
                            />
                            <input
                              type="text"
                              placeholder="Event Date"
                              value={t.date}
                              onChange={(e) => {
                                const updated = [...cmsTestimonialsList];
                                updated[idx].date = e.target.value;
                                setCmsTestimonialsList(updated);
                              }}
                              className="p-2 rounded border border-gray-300 font-sans"
                            />
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Quote text..."
                            value={t.quote}
                            onChange={(e) => {
                              const updated = [...cmsTestimonialsList];
                              updated[idx].quote = e.target.value;
                              setCmsTestimonialsList(updated);
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSaveCmsSection('testimonials', cmsTestimonialsList)}
                      className="px-6 py-3 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save size={14} /> Publish Testimonials Live
                    </button>
                  </div>
                )}

                {/* Sub-Tab 6: FAQs */}
                {activeCmsSubTab === 'faqs' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-semibold text-maroon-950">Frequently Asked Questions</h4>
                      <button
                        onClick={() => setCmsFaqsList([...cmsFaqsList, { id: `faq-${Date.now()}`, question: 'What is your booking timeline?', answer: 'We recommend reserving your date at least 2-4 months in advance.' }])}
                        className="px-3 py-1.5 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add FAQ Item
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      {cmsFaqsList.map((faq, idx) => (
                        <div key={faq.id || idx} className="p-4 bg-ivory-50/80 rounded-2xl border border-gray-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-gold-700">FAQ #{idx + 1}</span>
                            <button
                              onClick={() => setCmsFaqsList(cmsFaqsList.filter((_, i) => i !== idx))}
                              className="text-red-600 hover:bg-red-50 p-1 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Question"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...cmsFaqsList];
                              updated[idx].question = e.target.value;
                              setCmsFaqsList(updated);
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 font-serif font-medium text-maroon-950"
                          />
                          <textarea
                            rows={2}
                            placeholder="Answer"
                            value={faq.answer}
                            onChange={(e) => {
                              const updated = [...cmsFaqsList];
                              updated[idx].answer = e.target.value;
                              setCmsFaqsList(updated);
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 font-sans"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSaveCmsSection('faqs', cmsFaqsList)}
                      className="px-6 py-3 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save size={14} /> Publish FAQs Live
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* DYNAMIC PRICING RULES ENGINE VIEW */}
            {activeTab === 'pricing' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-maroon-950 flex items-center gap-2">
                      <IndianRupee className="text-gold-600" size={20} />
                      <span>Dynamic Pricing Rules Engine</span>
                    </h3>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">
                      Single source of truth powering both the public quote calculator and server-side price locking verification.
                    </p>
                  </div>

                  <button
                    onClick={() => handleSavePricingRules(pricingRulesData)}
                    className="px-5 py-2.5 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save size={14} /> Update Server Pricing Rules
                  </button>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 text-xs font-sans text-amber-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold block text-sm">Fixed Event Base Setup & Curation Fee</span>
                    <span className="text-[11px] text-amber-800">Applies to all luxury mobile bar setups (glassware, custom lighting, transport & barware).</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono font-bold text-sm">₹</span>
                    <input
                      type="number"
                      value={pricingRulesData.setupFee || 25000}
                      onChange={(e) => setPricingRulesData({ ...pricingRulesData, setupFee: Number(e.target.value) })}
                      className="w-28 p-2 rounded-lg border border-amber-300 font-mono font-bold text-sm outline-none bg-white text-right"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 font-bold">Event Type Base Prices & Per-Guest Rates</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {pricingRulesData.eventTypes?.map((rule: any, idx: number) => (
                      <div key={rule.eventType || idx} className="p-4 bg-ivory-50/80 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <span className="font-mono text-[10px] uppercase font-bold text-gold-700 block">{rule.eventType}</span>
                          <input
                            type="text"
                            value={rule.name}
                            onChange={(e) => {
                              const updated = [...pricingRulesData.eventTypes];
                              updated[idx].name = e.target.value;
                              setPricingRulesData({ ...pricingRulesData, eventTypes: updated });
                            }}
                            className="font-serif font-bold text-maroon-950 text-base border-b border-dashed border-gray-300 focus:border-gold-600 outline-none bg-transparent"
                          />
                        </div>

                        <div className="flex items-center gap-6 text-xs">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-gray-500 font-bold mb-1">Base Package Price (₹)</label>
                            <input
                              type="number"
                              value={rule.basePrice}
                              onChange={(e) => {
                                const updated = [...pricingRulesData.eventTypes];
                                updated[idx].basePrice = Number(e.target.value);
                                setPricingRulesData({ ...pricingRulesData, eventTypes: updated });
                              }}
                              className="w-32 p-2 rounded-lg border border-gray-300 font-mono font-bold text-xs outline-none bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-gray-500 font-bold mb-1">Per-Guest Rate (₹/Pax)</label>
                            <input
                              type="number"
                              value={rule.perGuestRate}
                              onChange={(e) => {
                                const updated = [...pricingRulesData.eventTypes];
                                updated[idx].perGuestRate = Number(e.target.value);
                                setPricingRulesData({ ...pricingRulesData, eventTypes: updated });
                              }}
                              className="w-32 p-2 rounded-lg border border-gray-300 font-mono font-bold text-xs outline-none bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN USER SIGN-UP & CREDENTIALS SUITE VIEW */}
            {activeTab === 'users' && (
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-maroon-950 flex items-center gap-2">
                      <UserPlus className="text-gold-600" size={20} />
                      <span>Production Admin Sign-Up & Credentials Control</span>
                    </h3>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">
                      Register new admin/staff team members, deactivate accounts, and force password resets.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {userProfile?.role === 'superadmin' && (
                      <button
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                      >
                        <UserPlus size={14} /> Register New Admin
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (userProfile) {
                          setProfEmail(userProfile.email);
                          setProfName(userProfile.name);
                          setProfPassword('');
                        }
                        setIsProfileModalOpen(true);
                      }}
                      className="px-4 py-2 bg-maroon-950 text-gold-400 hover:bg-maroon-900 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer border border-gold-500/20 shadow-sm transition-all"
                    >
                      <Key size={14} /> My Credentials
                    </button>
                  </div>
                </div>

                {/* Users List Table */}
                <div className="bg-ivory-50/50 rounded-2xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-maroon-950/5 text-maroon-950 text-[11px] font-mono uppercase tracking-wider border-b border-gray-200">
                        <th className="py-3.5 px-6">Name</th>
                        <th className="py-3.5 px-6">Email Account</th>
                        <th className="py-3.5 px-6">Access Role</th>
                        <th className="py-3.5 px-6">Account Status</th>
                        <th className="py-3.5 px-6 text-right">Superadmin Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-xs font-sans">
                      {usersList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500 font-mono">
                            No registered users loaded. Click "Register New Admin" to add your first account.
                          </td>
                        </tr>
                      ) : (
                        usersList.map((u) => (
                          <tr key={u.id} className="hover:bg-white transition-colors">
                            <td className="py-4 px-6 font-bold text-gray-900">{u.name}</td>
                            <td className="py-4 px-6 font-mono text-gray-700">{u.email}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                                u.role === 'superadmin' ? 'bg-gold-500/20 text-gold-800 border border-gold-400/40' : 'bg-gray-200 text-gray-800'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-mono text-[11px]">
                              {u.isDeactivated ? (
                                <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold uppercase text-[9px]">
                                  Deactivated
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[9px]">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              {userProfile?.role === 'superadmin' && u.id !== userProfile.id && (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleToggleDeactivateUser(u.id, u.email, Boolean(u.isDeactivated))}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                                      u.isDeactivated
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                    }`}
                                  >
                                    {u.isDeactivated ? 'Reactivate' : 'Deactivate'}
                                  </button>

                                  <button
                                    onClick={() => setForceResetModal({ isOpen: true, userId: u.id, userEmail: u.email, newPassword: '' })}
                                    className="px-3 py-1.5 bg-maroon-950 text-gold-400 hover:bg-maroon-900 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors border border-gold-500/20"
                                  >
                                    Reset Password
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* REGISTER NEW ADMIN USER MODAL */}
                {isRegisterModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold-500/20 shadow-2xl space-y-5 animate-scale-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h4 className="font-serif text-xl font-medium text-maroon-950 flex items-center gap-2">
                          <UserPlus className="text-gold-600" size={20} />
                          <span>Register Admin Account</span>
                        </h4>
                        <button onClick={() => setIsRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-mono text-sm cursor-pointer">✕</button>
                      </div>

                      <form onSubmit={handleRegisterUser} className="space-y-4 text-xs">
                        <div>
                          <label className="block font-mono font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="e.g. Vikram Singh"
                            className="w-full p-3 rounded-xl border border-gray-300 font-sans outline-none focus:border-gold-600"
                          />
                        </div>

                        <div>
                          <label className="block font-mono font-bold text-gray-700 uppercase mb-1">Admin Email *</label>
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="admin@barmantra.com"
                            className="w-full p-3 rounded-xl border border-gray-300 font-mono outline-none focus:border-gold-600"
                          />
                        </div>

                        <div>
                          <label className="block font-mono font-bold text-gray-700 uppercase mb-1">Role Privilege *</label>
                          <select
                            value={regRole}
                            onChange={(e) => setRegRole(e.target.value as any)}
                            className="w-full p-3 rounded-xl border border-gray-300 font-mono outline-none focus:border-gold-600 bg-white"
                          >
                            <option value="staff">Staff (Bookings & Contacts)</option>
                            <option value="admin">Admin (Full Operations)</option>
                            <option value="superadmin">Superadmin (All Privileges + Trash Restore)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-mono font-bold text-gray-700 uppercase mb-1">Initial Password Key *</label>
                          <input
                            type="password"
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Set secure password..."
                            className="w-full p-3 rounded-xl border border-gray-300 font-mono outline-none focus:border-gold-600"
                          />
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsRegisterModalOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-mono text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase cursor-pointer shadow-md"
                          >
                            Register Account
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* FORCE PASSWORD RESET MODAL */}
                {forceResetModal.isOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold-500/20 shadow-2xl space-y-5 animate-scale-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h4 className="font-serif text-xl font-medium text-maroon-950 flex items-center gap-2">
                          <Key className="text-gold-600" size={20} />
                          <span>Force Password Reset</span>
                        </h4>
                        <button onClick={() => setForceResetModal({ isOpen: false, userId: '', userEmail: '', newPassword: '' })} className="text-gray-400 hover:text-gray-600 font-mono text-sm cursor-pointer">✕</button>
                      </div>

                      <form onSubmit={handleForcePasswordReset} className="space-y-4 text-xs">
                        <p className="text-gray-600 font-sans">
                          Resetting password for: <strong className="font-mono text-maroon-950">{forceResetModal.userEmail}</strong>. Active session keys for this account will be invalidated immediately.
                        </p>

                        <div>
                          <label className="block font-mono font-bold text-gray-700 uppercase mb-1">New Password *</label>
                          <input
                            type="password"
                            required
                            value={forceResetModal.newPassword}
                            onChange={(e) => setForceResetModal({ ...forceResetModal, newPassword: e.target.value })}
                            placeholder="Enter new password (min 6 chars)..."
                            className="w-full p-3 rounded-xl border border-gray-300 font-mono outline-none focus:border-gold-600"
                          />
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setForceResetModal({ isOpen: false, userId: '', userEmail: '', newPassword: '' })}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-mono text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase cursor-pointer shadow-md"
                          >
                            Force Reset
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* CONFIRMATION MODAL DIALOG (SAFETY UX DETAIL 16) */}
                {confirmModal.isOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold-500/20 shadow-2xl space-y-5 animate-scale-in">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${confirmModal.isDanger ? 'bg-red-100 text-red-600' : 'bg-gold-100 text-gold-700'}`}>
                          <AlertCircle size={20} />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-maroon-950">
                          {confirmModal.title}
                        </h4>
                      </div>

                      <p className="text-xs text-gray-600 font-sans leading-relaxed">
                        {confirmModal.message}
                      </p>

                      <div className="pt-2 flex items-center justify-end space-x-3">
                        <button
                          onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                          className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-mono text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmModal.onConfirm}
                          className={`px-5 py-2.5 rounded-xl text-white font-mono font-bold text-xs uppercase cursor-pointer shadow-md ${
                            confirmModal.isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-maroon-950 hover:bg-maroon-900 text-gold-400'
                          }`}
                        >
                          Confirm Action
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MY CREDENTIALS MODAL */}
                {isProfileModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold-500/20 shadow-2xl space-y-5 animate-scale-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h4 className="font-serif text-xl font-medium text-maroon-950 flex items-center gap-2">
                          <Key className="text-gold-600" size={20} />
                          <span>Update Credentials</span>
                        </h4>
                        <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-mono text-sm cursor-pointer">✕</button>
                      </div>

                      <form onSubmit={handleUpdateCredentials} className="space-y-4 text-xs">
                        <div>
                          <label className="block font-mono font-bold text-gray-700 uppercase mb-1">Display Name</label>
                          <input
                            type="text"
                            value={profName}
                            onChange={(e) => setProfName(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 font-sans outline-none focus:border-gold-600"
                          />
                        </div>

                        <div>
                          <label className="block font-mono font-bold text-gray-700 uppercase mb-1">Email Account</label>
                          <input
                            type="email"
                            value={profEmail}
                            onChange={(e) => setProfEmail(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 font-mono outline-none focus:border-gold-600"
                          />
                        </div>

                        <div>
                          <label className="block font-mono font-bold text-gray-700 uppercase mb-1">New Password (Leave blank to keep current)</label>
                          <input
                            type="password"
                            value={profPassword}
                            onChange={(e) => setProfPassword(e.target.value)}
                            placeholder="Enter new password..."
                            className="w-full p-3 rounded-xl border border-gray-300 font-mono outline-none focus:border-gold-600"
                          />
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsProfileModalOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-mono text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 font-mono font-bold text-xs uppercase cursor-pointer shadow-md"
                          >
                            Save Credentials
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}
          </main>
        </div>
      </section>

    </div>
  );
}
