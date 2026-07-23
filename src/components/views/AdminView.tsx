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
  Archive
} from 'lucide-react';
import { useHashRoute } from '../../useHashRoute';
import { DbBooking, DbContact } from '../../server/db';

export function AdminView() {
  const { navigateTo } = useHashRoute();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [email, setEmail] = useState('admin@barmantra.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<'bookings' | 'contacts' | 'trash' | 'audit'>('bookings');
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [contacts, setContacts] = useState<DbContact[]>([]);
  const [trashItems, setTrashItems] = useState<{ bookings: DbBooking[]; contacts: DbContact[] }>({ bookings: [], contacts: [] });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [messageNotification, setMessageNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUserProfile(null);
      setPassword('');
    } catch (err) {
      console.error('Logout request failed:', err);
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
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
      const res = await fetch(`/api/admin/bookings/${id}/restore`, { method: 'POST' });
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
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
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
      const res = await fetch(`/api/admin/contacts/${id}/restore`, { method: 'POST' });
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

      {/* LEAD DATA VIEWER SYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl border border-gold-600/10 shadow-md overflow-hidden">
          
          {/* Header Controls */}
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* View Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setActiveTab('bookings'); setStatusFilter('all'); }}
                className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-maroon-950 text-gold-400'
                    : 'bg-ivory-50 text-maroon-950 hover:bg-ivory-100'
                }`}
              >
                Event Proposals ({bookings.length})
              </button>
              <button
                onClick={() => { setActiveTab('contacts'); setStatusFilter('all'); }}
                className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'contacts'
                    ? 'bg-maroon-950 text-gold-400'
                    : 'bg-ivory-50 text-maroon-950 hover:bg-ivory-100'
                }`}
              >
                General Inquiries ({contacts.length})
              </button>
              <button
                onClick={() => { setActiveTab('trash'); setStatusFilter('all'); }}
                className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'trash'
                    ? 'bg-maroon-950 text-gold-400'
                    : 'bg-ivory-50 text-maroon-950 hover:bg-ivory-100'
                }`}
              >
                <Archive size={13} />
                <span>Trash ({trashItems.bookings.length + trashItems.contacts.length})</span>
              </button>
              <button
                onClick={() => { setActiveTab('audit'); setStatusFilter('all'); }}
                className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'audit'
                    ? 'bg-maroon-950 text-gold-400'
                    : 'bg-ivory-50 text-maroon-950 hover:bg-ivory-100'
                }`}
              >
                <History size={13} />
                <span>Audit Logs</span>
              </button>
            </div>

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

          </div>

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
                              <button
                                onClick={() => handleRestoreBooking(tb.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                              >
                                <RotateCcw size={13} />
                                <span>Restore</span>
                              </button>
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
                              <button
                                onClick={() => handleRestoreContact(tc.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                              >
                                <RotateCcw size={13} />
                                <span>Restore</span>
                              </button>
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
          </div>

        </div>
      </section>

    </div>
  );
}
