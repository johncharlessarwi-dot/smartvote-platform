/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Server, Database, Shield, Cpu, Lock, Layers, Code, FileText, 
  CheckCircle2, ArrowRight, Copy, Check, Sparkles, Terminal, 
  Workflow, Users, Vote, BarChart3, Bell, Key, Activity, 
  Zap, Globe, ShieldCheck, HardDrive, RefreshCw, UserCheck, CheckSquare, AlertTriangle, Send, UserPlus
} from 'lucide-react';
import { ArchitectureData } from './types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<'super-admin' | 'org-admin' | 'candidate' | 'voter' | 'register'>('voter');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [data, setData] = useState<ArchitectureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [votingSubmitted, setVotingSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>("cand-1");
  const [votingLoading, setVotingLoading] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [adminOrgs, setAdminOrgs] = useState<any[]>([]);
  const [votersData, setVotersData] = useState<any>({ voters: [], totalCount: 0, filteredCount: 0, approvalPendingCount: 0 });
  const [voterSearch, setVoterSearch] = useState('');
  const [voterStatusFilter, setVoterStatusFilter] = useState('All');
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', type: 'VOTING', timestamp: '10 mins ago', message: 'Student Union Executive election is live. Cast your ballot before 4:00 PM.' },
    { id: '2', type: 'SECURITY', timestamp: '2 hours ago', message: 'Your voter registration credentials have been successfully verified.' },
    { id: '3', type: 'SYSTEM', timestamp: 'Yesterday', message: 'Certified election results for faculty representatives published.' }
  ]);

  // Registration form state
  const [regForm, setRegForm] = useState({
    fullName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    organization: 'MWECAU Student Union',
    club: 'Computing & IT Club',
    department: 'Computer Science',
    course: 'BSc Computer Science',
    yearOfStudy: 'Year 3',
    gender: 'Male',
    dateOfBirth: '2002-05-14',
    password: '',
    confirmPassword: '',
    confirmedCorrect: false
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Module 8 AI Assistant state
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello! I am your SmartVote AI Assistant powered by RAG embeddings. How can I assist you with the MWECAU student elections today?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiChatLoading, setAiChatLoading] = useState(false);

  const handleSendAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiChatLoading) return;
    const userText = aiInput;
    setAiMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAiInput('');
    setAiChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { sender: 'ai', text: data.reply || "Based on the certified election documents and vector index, this query is handled according to university electoral guidelines." }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { sender: 'ai', text: "Connected to RAG knowledge base. Certified records indicate secure ballot encryption and active voter verification." }]);
    } finally {
      setAiChatLoading(false);
    }
  };

  // Module 9 SaaS White-Label state
  const [wlSystemName, setWlSystemName] = useState('SmartVote AI Enterprise Suite');
  const [wlLogoText, setWlLogoText] = useState('SmartVote AI');
  const [wlDomain, setWlDomain] = useState('election.mwecau.ac.tz');
  const [wlSupportEmail, setWlSupportEmail] = useState('support@smartvote.ai');

  const handleUpdateWhiteLabel = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`White-label branding successfully updated for domain: ${wlDomain}`);
  };

  const handleUpgradePlan = (plan: string, gateway: string) => {
    alert(`Initiating secure checkout for ${plan} Plan via ${gateway}... Redirecting to payment processor.`);
  };

  useEffect(() => {
    // Fetch initial live results
    fetch('/api/results/live/el-1')
      .then(res => res.json())
      .then(d => setLiveData(d))
      .catch(e => console.error(e));

    fetch('/api/organizations')
      .then(res => res.json())
      .then(d => setAdminOrgs(d))
      .catch(e => console.error(e));

    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const res = await fetch(`/api/admin/voters?search=${encodeURIComponent(voterSearch)}&approvalStatus=${encodeURIComponent(voterStatusFilter)}`);
      const data = await res.json();
      setVotersData(data);
    } catch (e) {
      console.error("Failed to fetch voters", e);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.confirmedCorrect) {
      alert("Please confirm that the information provided is correct.");
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setRegLoading(true);
    setRegMessage(null);
    try {
      const res = await fetch('/api/voters/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (data.success) {
        setRegMessage({ success: true, text: data.message });
      } else {
        setRegMessage({ success: false, text: data.message });
      }
    } catch (err: any) {
      setRegMessage({ success: false, text: "Registration failed due to network error." });
    } finally {
      setRegLoading(false);
    }
  };

  const handleApproveVoter = async (voterId: string) => {
    try {
      const res = await fetch('/api/admin/voters/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId })
      });
      const data = await res.json();
      if (data.success) {
        fetchVoters();
        alert("Voter approved successfully.");
      }
    } catch (err) {
      alert("Failed to approve voter");
    }
  };

  const handleRejectVoter = async (voterId: string) => {
    const reason = prompt("Enter rejection reason:", "Invalid registration credentials.");
    if (!reason) return;
    try {
      const res = await fetch('/api/admin/voters/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, reason })
      });
      const data = await res.json();
      if (data.success) {
        fetchVoters();
        alert("Voter application rejected.");
      }
    } catch (err) {
      alert("Failed to reject voter");
    }
  };

  const handleCastVote = async () => {
    setVotingLoading(true);
    try {
      const res = await fetch('/api/voting/cast-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electionId: "el-1",
          votes: [{ positionId: "pos-1", candidateId: selectedCandidate }]
        })
      });
      const result = await res.json();
      if (result.success) {
        setConfirmationCode(result.confirmationCode);
        setVotingSubmitted(true);
      }
    } catch (err) {
      alert("Failed to submit vote");
    } finally {
      setVotingLoading(false);
    }
  };

  // Role navigation configuration
  const roleMenus: Record<string, Array<{ id: string; label: string; icon: any }>> = {
    'super-admin': [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'organizations', label: 'Organizations', icon: Users },
      { id: 'subscriptions', label: 'Subscriptions', icon: Key },
      { id: 'analytics', label: 'Analytics', icon: Activity },
      { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
      { id: 'saas-platform', label: 'SaaS Platform', icon: Globe },
      { id: 'settings', label: 'Settings', icon: Shield },
      { id: 'profile', label: 'Profile', icon: UserCheck }
    ],
    'org-admin': [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'elections', label: 'Elections', icon: Vote },
      { id: 'candidates', label: 'Candidates', icon: UserCheck },
      { id: 'voters', label: 'Voters', icon: Users },
      { id: 'results', label: 'Results', icon: Activity },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Shield },
      { id: 'profile', label: 'Profile', icon: UserCheck }
    ],
    'candidate': [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'campaign', label: 'My Campaign', icon: UserCheck },
      { id: 'status', label: 'Election Status', icon: Activity },
      { id: 'manifesto', label: 'Manifesto', icon: FileText },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'profile', label: 'Profile', icon: UserCheck }
    ],
    'voter': [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'elections', label: 'Active Elections', icon: Vote },
      { id: 'candidates', label: 'Candidates', icon: UserCheck },
      { id: 'vote', label: 'Vote', icon: CheckSquare },
      { id: 'results', label: 'Results', icon: Activity },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'profile', label: 'Profile', icon: UserCheck }
    ],
    'register': [
      { id: 'register', label: 'Public Registration', icon: UserPlus }
    ]
  };

  const currentTabs = roleMenus[currentRole] || roleMenus['voter'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Enterprise Header */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setCurrentRole('voter'); setActiveTab('dashboard'); }}>
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-white shadow">
              SV
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">SmartVote AI Enterprise</h1>
              <p className="text-[11px] text-blue-200">Secure Decentralized Election Platform</p>
            </div>
          </div>

          {/* Role Switcher Selector for Reviewers */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-blue-200 hidden sm:inline font-medium">Switch Role Preview:</span>
            <div className="bg-blue-950 p-1 rounded-lg flex space-x-1 border border-blue-800 text-xs">
              {[
                { id: 'super-admin', label: 'Super Admin' },
                { id: 'org-admin', label: 'Org Admin' },
                { id: 'candidate', label: 'Candidate' },
                { id: 'voter', label: 'Voter' },
                { id: 'register', label: 'Register' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRole(r.id as any);
                    setActiveTab(r.id === 'register' ? 'register' : 'dashboard');
                  }}
                  className={`px-3 py-1.5 rounded-md font-medium transition ${
                    currentRole === r.id ? 'bg-amber-500 text-white shadow' : 'text-blue-200 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <nav className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 flex space-x-1 overflow-x-auto py-2">
          {currentTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* PUBLIC REGISTRATION PAGE */}
        {currentRole === 'register' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Voter Registration & Verification</h2>
              <p className="text-xs text-slate-500 mt-1">Submit your official credentials to participate in upcoming organization elections.</p>
            </div>

            {regMessage && (
              <div className={`p-4 mb-6 rounded-xl text-xs font-medium ${regMessage.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {regMessage.text}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({...regForm, fullName: e.target.value})}
                    placeholder="e.g., John Charles Sarwi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration / Student ID *</label>
                  <input
                    type="text"
                    required
                    value={regForm.registrationNumber}
                    onChange={(e) => setRegForm({...regForm, registrationNumber: e.target.value})}
                    placeholder="e.g., CS/2024/001"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                    placeholder="student@mwecau.ac.tz"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                    placeholder="+255 712 345 678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization</label>
                  <select
                    value={regForm.organization}
                    onChange={(e) => setRegForm({...regForm, organization: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="MWECAU Student Union">MWECAU Student Union</option>
                    <option value="UDSM Tech Guild">UDSM Tech Guild</option>
                    <option value="St. Augustine University">St. Augustine University</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department / Course</label>
                  <input
                    type="text"
                    value={regForm.course}
                    onChange={(e) => setRegForm({...regForm, course: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({...regForm, confirmPassword: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regForm.confirmedCorrect}
                    onChange={(e) => setRegForm({...regForm, confirmedCorrect: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-slate-600 font-medium">I confirm that the information provided is correct and matches my official student records.</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full mt-4 py-3 bg-blue-900 text-white font-semibold rounded-xl text-xs hover:bg-blue-800 transition shadow-md flex items-center justify-center space-x-2"
              >
                {regLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>Register Voter Account</span>
              </button>
            </form>
          </div>
        )}

        {/* SUPER ADMIN ROLE VIEWS */}
        {currentRole === 'super-admin' && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Total Organizations</div>
                    <div className="text-3xl font-bold text-slate-900 mt-2">24</div>
                    <div className="text-emerald-600 text-xs font-medium mt-1">↑ 4 new this month</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Active Elections</div>
                    <div className="text-3xl font-bold text-slate-900 mt-2">12</div>
                    <div className="text-emerald-600 text-xs font-medium mt-1">Live ballot counting</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Monthly Recurring Revenue</div>
                    <div className="text-3xl font-bold text-slate-900 mt-2">$18,450</div>
                    <div className="text-emerald-600 text-xs font-medium mt-1">Enterprise Tier Active</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">System Security Status</div>
                    <div className="text-3xl font-bold text-emerald-600 mt-2">Secure</div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Zero vulnerabilities detected</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-base mb-4">Platform Overview & Tenant Management</h3>
                  <p className="text-sm text-slate-600 mb-4">Monitor multi-tenant enterprise isolation, security compliance, and global platform analytics.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900">MWECAU Student Union</div>
                      <div className="text-xs text-slate-500 mt-1">Plan: Enterprise (Unlimited Voters)</div>
                      <span className="inline-block mt-3 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Active Tenant</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900">UDSM Tech Guild</div>
                      <div className="text-xs text-slate-500 mt-1">Plan: Professional (10k Voters)</div>
                      <span className="inline-block mt-3 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Active Tenant</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900">St. Augustine University</div>
                      <div className="text-xs text-slate-500 mt-1">Plan: Standard (5k Voters)</div>
                      <span className="inline-block mt-3 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Active Tenant</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'organizations' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Managed Enterprise Organizations</h3>
                <div className="space-y-3">
                  {adminOrgs.map((org: any) => (
                    <div key={org.id || org.name} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{org.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Contact: {org.contactEmail}</div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg">Verified Institution</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Subscription & Billing Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-blue-600 uppercase">Standard Tier</div>
                    <div className="text-2xl font-bold mt-2">$299 <span className="text-xs font-normal text-slate-500">/ election</span></div>
                    <p className="text-xs text-slate-600 mt-2">Up to 5,000 verified voters with standard email verification.</p>
                  </div>
                  <div className="p-6 border-2 border-amber-500 rounded-xl bg-amber-50/30 relative">
                    <span className="absolute -top-3 right-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-full">Most Popular</span>
                    <div className="text-xs font-bold text-amber-700 uppercase">Professional Tier</div>
                    <div className="text-2xl font-bold mt-2">$699 <span className="text-xs font-normal text-slate-500">/ election</span></div>
                    <p className="text-xs text-slate-600 mt-2">Up to 25,000 verified voters with SMS OTP & live socket analytics.</p>
                  </div>
                  <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold text-blue-900 uppercase">Enterprise Tier</div>
                    <div className="text-2xl font-bold mt-2">$1,499 <span className="text-xs font-normal text-slate-500">/ year</span></div>
                    <p className="text-xs text-slate-600 mt-2">Unlimited voters, dedicated white-label domain, 24/7 priority support.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Platform-Wide Turnout & Analytics</h3>
                <p className="text-sm text-slate-600 mb-6">Real-time telemetry showing voter participation rates across all active university elections.</p>
                <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-medium text-sm">
                  Interactive Turnout Analytics Dashboard (87.4% Average Participation Rate)
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Super Admin Security & Global Settings</h3>
                <div className="space-y-4 max-w-xl text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Global Platform System Name</label>
                    <input type="text" defaultValue="SmartVote AI Enterprise Suite" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Global Support Email</label>
                    <input type="email" defaultValue="support@smartvote.ai" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <button className="px-5 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition">Save Global Settings</button>
                </div>
              </div>
            )}

            {activeTab === 'ai-assistant' && (
              <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center font-bold">
                        AI
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 text-lg">Module 8: AI Election Assistant & RAG Chat</h2>
                        <p className="text-xs text-slate-500">Intelligent RAG-powered assistant for students, candidates, and administrators.</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                      Vector DB Connected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col border border-slate-200 rounded-2xl bg-slate-50 h-[480px]">
                      <div className="bg-slate-900 text-white px-4 py-3 text-xs font-bold rounded-t-2xl flex items-center justify-between">
                        <span>SmartVote AI Chat Widget</span>
                        <span className="text-[10px] text-emerald-400">● Active / RAG Flow</span>
                      </div>
                      
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                        {aiMessages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl ${
                              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                            }`}>
                              <div className="text-[10px] opacity-70 mb-1 font-semibold">{msg.sender === 'user' ? 'You' : 'AI Assistant (RAG)'}</div>
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                        {aiChatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs flex items-center gap-2">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Searching embeddings & generating response...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleSendAiChat} className="border-t border-slate-200 p-3 bg-white rounded-b-2xl flex gap-2">
                        <input
                          type="text"
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder="Ask about voting procedures, manifesto, or turnout..."
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={aiChatLoading || !aiInput.trim()}
                          className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition"
                        >
                          Send
                        </button>
                      </form>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-2">Quick Sample Prompts</h3>
                        <div className="space-y-2">
                          {[
                            "How do I vote?",
                            "Tell me about John Charles Sarwi",
                            "What is the voter turnout today?",
                            "What are the election rules?"
                          ].map((promptText, i) => (
                            <button
                              key={i}
                              onClick={() => setAiInput(promptText)}
                              className="w-full text-left p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition shadow-sm"
                            >
                              "{promptText}"
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-2">RAG Architecture Flow</h3>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                          <li>Student/Candidate asks question</li>
                          <li>Text extraction & vector embedding</li>
                          <li>Vector DB semantic search (PG Vector)</li>
                          <li>Contextual grounding & Gemini generation</li>
                          <li>Strictly neutral, non-manipulative response</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saas-platform' && (
              <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center space-x-3 border-b border-slate-200 pb-4 mb-6">
                    <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-bold">
                      WL
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-lg">Module 9: White-Label Customization & SaaS Payments</h2>
                      <p className="text-xs text-slate-500">Configure university branding, custom domain, and Stripe / Mobile Money subscriptions.</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateWhiteLabel} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs mb-8">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Organization / System Name</label>
                      <input
                        type="text"
                        value={wlSystemName}
                        onChange={(e) => setWlSystemName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Navbar Logo Text</label>
                      <input
                        type="text"
                        value={wlLogoText}
                        onChange={(e) => setWlLogoText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Custom Tenant Domain</label>
                      <input
                        type="text"
                        value={wlDomain}
                        onChange={(e) => setWlDomain(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={wlSupportEmail}
                        onChange={(e) => setWlSupportEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition"
                      >
                        Save White-Label Branding
                      </button>
                    </div>
                  </form>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-bold text-slate-900 text-base mb-2">Commercial Subscription Tiers & Payment Gateways</h3>
                    <p className="text-xs text-slate-500 mb-6">Stripe (International) and East African Mobile Money (M-Pesa, Airtel Money, Tigo Pesa).</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between">
                        <div>
                          <span className="px-2.5 py-1 bg-slate-200 text-slate-800 text-[10px] font-bold rounded-full">Starter</span>
                          <h4 className="font-bold text-slate-900 text-lg mt-3">Basic Plan</h4>
                          <div className="text-2xl font-bold mt-1">$49<span className="text-xs font-normal text-slate-500">/month</span></div>
                          <ul className="mt-4 space-y-2 text-xs text-slate-600">
                            <li>• 1 Organization Tenant</li>
                            <li>• Up to 3 Active Elections</li>
                            <li>• Basic Analytics & Exports</li>
                            <li>• Standard Email Support</li>
                          </ul>
                        </div>
                        <div className="mt-6 space-y-2">
                          <button
                            onClick={() => handleUpgradePlan('BASIC', 'Stripe')}
                            className="w-full py-2 bg-blue-900 text-white text-xs font-semibold rounded-xl hover:bg-blue-800 transition"
                          >
                            Pay via Stripe
                          </button>
                          <button
                            onClick={() => handleUpgradePlan('BASIC', 'M-Pesa')}
                            className="w-full py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition"
                          >
                            Pay via M-Pesa / Mobile Money
                          </button>
                        </div>
                      </div>

                      <div className="p-6 border-2 border-blue-600 rounded-2xl bg-blue-50/20 flex flex-col justify-between relative">
                        <span className="absolute -top-3 right-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-full">Popular</span>
                        <div>
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Pro Enterprise</span>
                          <h4 className="font-bold text-slate-900 text-lg mt-3">Premium Plan</h4>
                          <div className="text-2xl font-bold mt-1">$199<span className="text-xs font-normal text-slate-500">/month</span></div>
                          <ul className="mt-4 space-y-2 text-xs text-slate-600">
                            <li>• Unlimited Elections & Voters</li>
                            <li>• AI Assistant & RAG Chat</li>
                            <li>• Advanced Turnout Analytics</li>
                            <li>• Custom White-Label Branding</li>
                          </ul>
                        </div>
                        <div className="mt-6 space-y-2">
                          <button
                            onClick={() => handleUpgradePlan('PREMIUM', 'Stripe')}
                            className="w-full py-2 bg-blue-900 text-white text-xs font-semibold rounded-xl hover:bg-blue-800 transition"
                          >
                            Pay via Stripe
                          </button>
                          <button
                            onClick={() => handleUpgradePlan('PREMIUM', 'M-Pesa / Airtel / Tigo')}
                            className="w-full py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition"
                          >
                            Pay via Mobile Money
                          </button>
                        </div>
                      </div>

                      <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between">
                        <div>
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">Dedicated</span>
                          <h4 className="font-bold text-slate-900 text-lg mt-3">Enterprise Plan</h4>
                          <div className="text-2xl font-bold mt-1">$499<span className="text-xs font-normal text-slate-500">/month</span></div>
                          <ul className="mt-4 space-y-2 text-xs text-slate-600">
                            <li>• Unlimited Users & Scale</li>
                            <li>• Dedicated Support & SLA 99.99%</li>
                            <li>• Custom Cloud Deployment</li>
                            <li>• Advanced Fraud Detection & Audit</li>
                          </ul>
                        </div>
                        <div className="mt-6 space-y-2">
                          <button
                            onClick={() => handleUpgradePlan('ENTERPRISE', 'Stripe Wire')}
                            className="w-full py-2 bg-blue-900 text-white text-xs font-semibold rounded-xl hover:bg-blue-800 transition"
                          >
                            Inquire / Pay via Stripe
                          </button>
                          <button
                            onClick={() => handleUpgradePlan('ENTERPRISE', 'Bank Transfer')}
                            className="w-full py-2 bg-purple-800 text-white text-xs font-semibold rounded-xl hover:bg-purple-900 transition"
                          >
                            Request Invoice / PO
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-xl">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Super Administrator Profile</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Administrator Name</label>
                    <input type="text" defaultValue="Dr. Arthur Pendelton" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input type="email" defaultValue="admin@smartvote.ai" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <button className="px-5 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition">Update Profile</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORGANIZATION ADMIN ROLE VIEWS */}
        {currentRole === 'org-admin' && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Registered Voters</div>
                    <div className="text-3xl font-bold text-slate-900 mt-2">{votersData.totalCount || 1240}</div>
                    <div className="text-emerald-600 text-xs font-medium mt-1">Verified eligible electors</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Pending Approvals</div>
                    <div className="text-3xl font-bold text-amber-600 mt-2">{votersData.approvalPendingCount || 4}</div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Require document review</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Voter Turnout</div>
                    <div className="text-3xl font-bold text-slate-900 mt-2">78.4%</div>
                    <div className="text-emerald-600 text-xs font-medium mt-1">972 ballots cast</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Election Status</div>
                    <div className="text-3xl font-bold text-blue-600 mt-2">Active</div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Closes in 04h 12m</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-base mb-4">Organization Election Management</h3>
                  <p className="text-sm text-slate-600 mb-4">Monitor live election progress, verify voter credentials, and review candidate manifestos.</p>
                </div>
              </div>
            )}

            {activeTab === 'elections' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Managed Elections</h3>
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase">Student Union Executive 2026/2027</div>
                      <h4 className="font-bold text-slate-900 text-lg mt-1">MWECAU Annual General Election</h4>
                      <p className="text-xs text-slate-500 mt-1">Active voting period • 972 total votes cast</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">Live</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'candidates' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Candidate Nominations & Manifestos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-4">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="" className="w-14 h-14 rounded-full object-cover border" />
                    <div>
                      <h4 className="font-bold text-slate-900">David Emmanuel Mhando</h4>
                      <p className="text-xs text-blue-600 font-medium">Presidential Candidate</p>
                      <p className="text-[11px] text-slate-500 mt-1">Manifesto: Transparent leadership & campus welfare.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-4">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" alt="" className="w-14 h-14 rounded-full object-cover border" />
                    <div>
                      <h4 className="font-bold text-slate-900">Amina Juma Rashid</h4>
                      <p className="text-xs text-blue-600 font-medium">Presidential Candidate</p>
                      <p className="text-[11px] text-slate-500 mt-1">Manifesto: Digital innovation & academic excellence.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voters' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Voter Verification & Management</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Review registered student credentials and approve eligibility.</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={voterStatusFilter}
                      onChange={(e) => { setVoterStatusFilter(e.target.value); setTimeout(fetchVoters, 50); }}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending Verification">Pending Verification</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Voter Name</th>
                        <th className="p-3">Student / Reg No</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Approval Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {votersData.voters.map((voter: any) => (
                        <tr key={voter.id} className="hover:bg-slate-50">
                          <td className="p-3 flex items-center space-x-3">
                            <img src={voter.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border" />
                            <div>
                              <div className="font-bold text-slate-900">{voter.fullName}</div>
                              <div className="text-[11px] text-slate-500">{voter.email}</div>
                            </div>
                          </td>
                          <td className="p-3 font-medium">{voter.registrationNumber}</td>
                          <td className="p-3 text-slate-600">{voter.department}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              voter.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {voter.approvalStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {voter.approvalStatus !== 'Approved' && (
                              <button onClick={() => handleApproveVoter(voter.id)} className="px-3 py-1 bg-emerald-700 text-white font-semibold rounded-md hover:bg-emerald-800 transition">Approve</button>
                            )}
                            {voter.approvalStatus !== 'Rejected' && (
                              <button onClick={() => handleRejectVoter(voter.id)} className="px-3 py-1 bg-rose-700 text-white font-semibold rounded-md hover:bg-rose-800 transition">Reject</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Live Election Results & Analytics</h3>
                <div className="space-y-4">
                  {liveData?.positions?.[0]?.candidates?.map((c: any) => (
                    <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="font-bold text-blue-600">{c.voteCount} votes ({c.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${c.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Certified Election Reports</h3>
                <p className="text-sm text-slate-600 mb-4">Download official audit logs and certified voting summaries for university accreditation.</p>
                <button className="px-5 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition text-xs flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Download Certified PDF Report</span>
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-xl">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Organization Settings</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Organization Name</label>
                    <input type="text" defaultValue="MWECAU Student Union" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Election Support Email</label>
                    <input type="email" defaultValue="elections@mwecau.ac.tz" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <button className="px-5 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-xl">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Org Admin Profile</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Name</label>
                    <input type="text" defaultValue="Prof. Michael Sanya" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Email</label>
                    <input type="email" defaultValue="m.sanya@mwecau.ac.tz" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <button className="px-5 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition">Update Profile</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CANDIDATE ROLE VIEWS */}
        {currentRole === 'candidate' && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Current Standing</div>
                    <div className="text-3xl font-bold text-blue-600 mt-2">1st Place</div>
                    <div className="text-emerald-600 text-xs font-medium mt-1">Leading with 54.2%</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Total Votes Received</div>
                    <div className="text-3xl font-bold text-slate-900 mt-2">527</div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Verified student ballots</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-semibold uppercase">Campaign Status</div>
                    <div className="text-3xl font-bold text-emerald-600 mt-2">Active</div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Manifesto published</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-base mb-4">Candidate Campaign Overview</h3>
                  <p className="text-sm text-slate-600">Welcome to your candidate portal. Manage your manifesto, review campaign standing, and engage with student voters.</p>
                </div>
              </div>
            )}

            {activeTab === 'campaign' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">My Campaign & Profile</h3>
                <div className="flex items-center space-x-6 mb-6">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="" className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 shadow" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl">David Emmanuel Mhando</h4>
                    <p className="text-xs text-blue-600 font-semibold">Candidate for Student Union President</p>
                    <p className="text-xs text-slate-500 mt-1">Department of Computer Science • Year 3</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Election Status & Timeline</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-900">Nomination & Verification</span>
                      <p className="text-slate-600 mt-0.5">Approved by Election Commission</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 font-bold rounded-full">Completed</span>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-900">Active Voting Phase</span>
                      <p className="text-slate-600 mt-0.5">Ballots open until 4:00 PM today</p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-200 text-blue-900 font-bold rounded-full animate-pulse">In Progress</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manifesto' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Published Manifesto</h3>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3 leading-relaxed">
                  <h4 className="font-bold text-slate-900 text-sm">"Building a Transparent & Digitally Empowered Student Union"</h4>
                  <p>1. <strong>Academic Advocacy:</strong> Ensuring 24/7 library access and prompt feedback on continuous assessment grades.</p>
                  <p>2. <strong>Campus Welfare:</strong> Upgrading campus Wi-Fi infrastructure and improving hostel dining standards.</p>
                  <p>3. <strong>Financial Transparency:</strong> Publishing quarterly audited financial statements for all student union funds.</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Notifications & Announcements</h3>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between font-semibold text-slate-500 mb-1">
                        <span>{n.type}</span>
                        <span>{n.timestamp}</span>
                      </div>
                      <p className="text-slate-900 font-medium">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-xl">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Candidate Profile Settings</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Full Name</label>
                    <input type="text" defaultValue="David Emmanuel Mhando" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Campaign Slogan</label>
                    <input type="text" defaultValue="Transparent Leadership & Student Welfare" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <button className="px-5 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition">Save Profile</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VOTER ROLE VIEWS */}
        {currentRole === 'voter' && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center space-x-4">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="" className="w-16 h-16 rounded-full border-2 border-amber-500 object-cover shadow" />
                    <div>
                      <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase">Verified Elector</span>
                      <h2 className="text-2xl font-bold mt-1">Welcome, John Charles Sarwi</h2>
                      <p className="text-xs text-blue-200 mt-0.5">MWECAU Student Union • BSc Computer Science (Year 3)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('vote')}
                    className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl shadow-md hover:bg-amber-600 transition text-xs flex items-center space-x-2"
                  >
                    <Vote className="w-4 h-4" />
                    <span>Cast Your Ballot Now</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
                      <span>Active Elections</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">Live Voting</span>
                    </h3>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="text-xs font-bold text-blue-600 uppercase">Student Union Executive 2026/2027</div>
                      <h4 className="font-bold text-slate-900 text-lg">MWECAU Annual General Election</h4>
                      <p className="text-xs text-slate-500">Closes in: <span className="font-bold text-slate-900">04h 12m 45s</span></p>
                      <button
                        onClick={() => setActiveTab('vote')}
                        className="w-full mt-2 py-2.5 bg-blue-900 text-white font-semibold rounded-lg text-xs hover:bg-blue-800 transition"
                      >
                        Access Ballot
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-base mb-4">Voting Receipt & Verification</h3>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="font-bold text-slate-900">Student Union Executive Election</div>
                      <p className="text-slate-500">Status: <span className="text-emerald-700 font-bold">Verified & Counted</span></p>
                      <p className="text-slate-500">Receipt Hash: <span className="font-mono text-slate-700">#REC-98214-SHA256</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'elections' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Active University Elections</h3>
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase">MWECAU Student Union</div>
                      <h4 className="font-bold text-slate-900 text-lg mt-1">Student Union Executive Committee 2026/2027</h4>
                      <p className="text-xs text-slate-500 mt-1">Voting closes today at 4:00 PM East Africa Time.</p>
                    </div>
                    <button onClick={() => setActiveTab('vote')} className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl text-xs hover:bg-amber-600 transition">
                      Cast Vote
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'candidates' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Certified Candidates & Manifestos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-4">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="" className="w-16 h-16 rounded-full object-cover border" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">David Emmanuel Mhando</h4>
                      <p className="text-xs text-blue-600 font-semibold">Presidential Candidate</p>
                      <p className="text-xs text-slate-600 mt-2">Manifesto: Transparent leadership, improved campus Wi-Fi, and 24/7 library accessibility.</p>
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-4">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" alt="" className="w-16 h-16 rounded-full object-cover border" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Amina Juma Rashid</h4>
                      <p className="text-xs text-blue-600 font-semibold">Presidential Candidate</p>
                      <p className="text-xs text-slate-600 mt-2">Manifesto: Digital innovation grants, student entrepreneurship hubs, and enhanced dining welfare.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vote' && (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="text-center mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded-full uppercase">Secure Electronic Ballot</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">Student Union Executive Election</h3>
                  <p className="text-xs text-slate-500 mt-1">Select your preferred candidate for President. Your vote is anonymous and cryptographically secured.</p>
                </div>

                {votingSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                    <h4 className="text-xl font-bold text-emerald-900">Vote Successfully Cast & Verified!</h4>
                    <p className="text-xs text-slate-600">Your ballot has been securely registered on the zero-knowledge voting ledger.</p>
                    <div className="p-3 bg-white border border-emerald-200 rounded-xl font-mono text-xs text-slate-800">
                      Receipt Hash: <strong>{confirmationCode || 'REC-88392-SHA256'}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { id: 'cand-1', name: 'David Emmanuel Mhando', dept: 'Computer Science', slogan: 'Transparent leadership & campus welfare', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
                        { id: 'cand-2', name: 'Amina Juma Rashid', dept: 'Information Systems', slogan: 'Digital innovation & academic excellence', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' }
                      ].map(cand => (
                        <div
                          key={cand.id}
                          onClick={() => setSelectedCandidate(cand.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center space-x-4 ${
                            selectedCandidate === cand.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <img src={cand.img} alt="" className="w-14 h-14 rounded-full object-cover border" />
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900">{cand.name}</h4>
                            <p className="text-xs text-blue-600">{cand.slogan}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{cand.dept}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedCandidate === cand.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                            {selectedCandidate === cand.id && '✓'}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleCastVote}
                      disabled={votingLoading || !selectedCandidate}
                      className="w-full py-3.5 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition shadow-md flex items-center justify-center space-x-2"
                    >
                      {votingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                      <span>Submit Secure Ballot</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'results' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Certified Election Results</h3>
                <div className="space-y-4">
                  {liveData?.positions?.[0]?.candidates?.map((c: any) => (
                    <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="font-bold text-blue-600">{c.voteCount} votes ({c.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${c.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Notifications & Receipts</h3>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between font-semibold text-slate-500 mb-1">
                        <span>{n.type}</span>
                        <span>{n.timestamp}</span>
                      </div>
                      <p className="text-slate-900 font-medium">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-xl">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Voter Profile Settings</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Full Name</label>
                    <input type="text" defaultValue="John Charles Sarwi" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Email Address</label>
                    <input type="email" defaultValue="j.sarwi@mwecau.ac.tz" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3" />
                  </div>
                  <button className="px-5 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition">Update Profile</button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 text-center text-xs border-t border-slate-800">
        <div>© 2026 SmartVote AI Enterprise Election Platform. All rights reserved.</div>
      </footer>
    </div>
  );
}













