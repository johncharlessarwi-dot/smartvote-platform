


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Server, Database, Shield, Cpu, Lock, Layers, Code, FileText, 
  CheckCircle2, ArrowRight, Copy, Check, Sparkles, Terminal, 
  Workflow, Users, Vote, BarChart3, Bell, Key, Activity, 
  Zap, Globe, ShieldCheck, HardDrive, RefreshCw, UserCheck, CheckSquare, AlertTriangle, Send, UserPlus,
  Building2, BookOpen, Briefcase, Award, Calendar, Share2, Trash2, Archive, Download, ExternalLink, Eye, Star, CheckCircle, Clock, MapPin, UploadCloud, ShieldAlert, FileCheck, FolderOpen, Filter, Search, Plus, Edit3, X
} from 'lucide-react';
import { ArchitectureData } from './types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<'super-admin' | 'org-admin' | 'candidate' | 'voter' | 'register'>('super-admin');
  const [activeTab, setActiveTab] = useState<string>('candidate-profile');
  const [data, setData] = useState<ArchitectureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [votingSubmitted, setVotingSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>("cand-1");
  const [votingLoading, setVotingLoading] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  
  // Super Admin Organizations State
  const [adminOrgs, setAdminOrgs] = useState<any[]>([
    { id: "org-1", name: "Mwenge Catholic University", contactEmail: "admin@mwecau.ac.tz", status: "ACTIVE", primaryColor: "#2563eb", createdAt: "2025-01-15", hasActiveElection: true, hasUnpaidSub: false, hasPendingApprovals: false },
    { id: "org-2", name: "University of Dar es Salaam", contactEmail: "admin@udsm.ac.tz", status: "ACTIVE", primaryColor: "#059669", createdAt: "2025-03-10", hasActiveElection: false, hasUnpaidSub: false, hasPendingApprovals: false },
    { id: "org-3", name: "St. Augustine University", contactEmail: "admin@saut.ac.tz", status: "ARCHIVED", primaryColor: "#d97706", createdAt: "2024-11-20", hasActiveElection: false, hasUnpaidSub: false, hasPendingApprovals: false }
  ]);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgEmail, setNewOrgEmail] = useState('');
  const [orgDeleteModal, setOrgDeleteModal] = useState<{ isOpen: boolean; org: any | null; confirmText: string; canDelete: boolean; reason: string }>({ isOpen: false, org: null, confirmText: '', canDelete: false, reason: '' });

  // Multi-Tenant Organization Authentication State
  const [orgAuthUser, setOrgAuthUser] = useState<{
    loggedIn: boolean;
    orgId: string;
    orgName: string;
    username: string;
    role: 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'ORGANIZATION_MANAGER' | 'ELECTION_OFFICER' | 'VIEWER';
    email: string;
    token: string;
  }>({
    loggedIn: true,
    orgId: 'org-1',
    orgName: 'Mwenge Catholic University',
    username: 'admin_mwecau',
    role: 'ORGANIZATION_ADMIN',
    email: 'admin@mwecau.ac.tz',
    token: 'jwt_secure_auth_token_998418'
  });

  const [orgLoginEmail, setOrgLoginEmail] = useState('admin@mwecau.ac.tz');
  const [orgLoginPassword, setOrgLoginPassword] = useState('securePass123!');
  const [orgLoginRole, setOrgLoginRole] = useState<'ORGANIZATION_ADMIN' | 'ORGANIZATION_MANAGER' | 'ELECTION_OFFICER' | 'VIEWER'>('ORGANIZATION_ADMIN');
  const [orgLoginOrgId, setOrgLoginOrgId] = useState('org-1');
  const [orgDashboardSubTab, setOrgDashboardSubTab] = useState<'overview' | 'elections' | 'candidates' | 'voters' | 'campaigns' | 'reports' | 'notifications' | 'audit-logs' | 'settings'>('overview');

  const handleOrgLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrg = adminOrgs.find(o => o.id === orgLoginOrgId) || adminOrgs[0];
    if (targetOrg.status === 'SUSPENDED' || targetOrg.status === 'ARCHIVED') {
      alert(`Access denied: Organization "${targetOrg.name}" is currently ${targetOrg.status}. Please contact Super Admin.`);
      return;
    }
    setOrgAuthUser({
      loggedIn: true,
      orgId: targetOrg.id,
      orgName: targetOrg.name,
      username: orgLoginEmail.split('@')[0],
      role: orgLoginRole,
      email: orgLoginEmail,
      token: 'jwt_tenant_' + Math.random().toString(36).substring(2, 15)
    });
    setAuditLogsList([
      { id: "log-" + (auditLogsList.length + 1), userId: orgLoginEmail, organizationId: targetOrg.id, action: "ORGANIZATION_LOGIN", description: `Authenticated into organization ${targetOrg.name} with role ${orgLoginRole}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
      ...auditLogsList
    ]);
    setActiveTab('org-dashboard');
    alert(`Successfully signed in to ${targetOrg.name} dashboard as ${orgLoginRole}. Tenant isolation active.`);
  };

  const handleOrgLogout = () => {
    setAuditLogsList([
      { id: "log-" + (auditLogsList.length + 1), userId: orgAuthUser.username, organizationId: orgAuthUser.orgId, action: "ORGANIZATION_LOGOUT", description: `Logged out from organization ${orgAuthUser.orgName}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
      ...auditLogsList
    ]);
    setOrgAuthUser({
      loggedIn: false,
      orgId: '',
      orgName: '',
      username: '',
      role: 'VIEWER',
      email: '',
      token: ''
    });
    setActiveTab('org-login');
  };

  // Clubs State with Organization Context
  const [clubsList, setClubsList] = useState<any[]>([
    { id: "club-1", organizationId: "org-1", name: "Computing & IT Society", faculty: "Faculty of Science & Technology", department: "Computer Science", patron: "Dr. Joseph Mhagama", email: "cit@mwecau.ac.tz", status: "ACTIVE", category: "Academic" },
    { id: "club-2", organizationId: "org-1", name: "Business & Economics Club", faculty: "Faculty of Business", department: "Economics", patron: "Prof. Mary Mwakyusa", email: "econ@mwecau.ac.tz", status: "ACTIVE", category: "Professional" },
    { id: "club-3", organizationId: "org-1", name: "Debating Society", faculty: "Faculty of Arts & Social Sciences", department: "Law & Philosophy", patron: "Dr. Peter Kimaro", email: "debate@mwecau.ac.tz", status: "ACTIVE", category: "Cultural" }
  ]);
  const [selectedOrgContext, setSelectedOrgContext] = useState<string>("org-1");
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState<any | null>(null);
  const [clubForm, setClubForm] = useState({
    name: '',
    faculty: 'Faculty of Science & Technology',
    department: 'Computer Science',
    patron: '',
    email: '',
    category: 'Academic',
    organizationId: 'org-1'
  });

  // Voter Portal State
  const [voterRegNumber, setVoterRegNumber] = useState('');
  const [voterFullName, setVoterFullName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterRegistered, setVoterRegistered] = useState(false);
  const [voterVoted, setVoterVoted] = useState(false);
  const [voterChoiceId, setVoterChoiceId] = useState('');
  const [voterReceipt, setVoterReceipt] = useState<string | null>(null);

  // Candidates & Management State
  const [candidatesManagement, setCandidatesManagement] = useState<any[]>([
    {
      id: "cand-1",
      slug: "john-charles-sarwi",
      fullName: "John Charles Sarwi",
      regNumber: "CS/2024/001",
      gender: "Male",
      email: "johncharlessarwi@gmail.com",
      phone: "+255 712 345 678",
      faculty: "Faculty of Science & Technology",
      department: "Computer Science",
      course: "BSc Computer Science",
      yearOfStudy: "Year 3",
      position: "President",
      club: "Computing & IT Society",
      biography: "Passionate technologist, open-source advocate, and student leader dedicated to academic excellence and digital transformation across campus.",
      manifesto: "Advocating for 24/7 campus Wi-Fi, transparent student budgeting, annual hackathons, and upgraded computer laboratories.",
      slogan: "Innovation, Transparency & Student Welfare",
      campaignColor: "#2563eb",
      approvalStatus: "Approved",
      candidateStatus: "Active",
      votesCount: 560,
      hasReceivedVotes: true,
      socials: { facebook: "john.sarwi", instagram: "@john_sarwi", x: "@johnsarwi", linkedin: "in/johnsarwi", email: "john@smartvote.ai" }
    },
    {
      id: "cand-2",
      slug: "peter-joseph",
      fullName: "Peter Joseph",
      regNumber: "IT/2024/045",
      gender: "Male",
      email: "peter.joseph@mwecau.ac.tz",
      phone: "+255 754 111 222",
      faculty: "Faculty of Science & Technology",
      department: "Information Technology",
      course: "BSc Information Technology",
      yearOfStudy: "Year 3",
      position: "President",
      club: "Computing & IT Society",
      biography: "Dedicated IT specialist with extensive experience in student representation and digital skills training workshops.",
      manifesto: "Focusing on modern computer labs, student welfare grants, career mentorship, and partnership with tech hubs.",
      slogan: "Empowering Students Through Digital Excellence",
      campaignColor: "#059669",
      approvalStatus: "Approved",
      candidateStatus: "Active",
      votesCount: 316,
      hasReceivedVotes: true,
      socials: { instagram: "@peter_it", email: "peter@mwecau.ac.tz" }
    }
  ]);

  // Candidate Remove Modal with votes check
  const [removeCandidateModal, setRemoveCandidateModal] = useState<{ isOpen: boolean; candidate: any | null }>({ isOpen: false, candidate: null });

  // Add Candidate Form State
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [newCandForm, setNewCandForm] = useState({
    fullName: '',
    regNumber: '',
    gender: 'Male',
    email: '',
    phone: '',
    faculty: 'Faculty of Science & Technology',
    department: 'Computer Science',
    course: 'BSc Computer Science',
    yearOfStudy: 'Year 3',
    position: 'President',
    club: 'Computing & IT Society',
    biography: '',
    manifesto: '',
    slogan: ''
  });

  // Search & Filters for Candidates
  const [candSearch, setCandSearch] = useState('');
  const [candFilterClub, setCandFilterClub] = useState('All');
  const [candFilterStatus, setCandFilterStatus] = useState('All');

  // Audit Logs State
  const [auditLogsList, setAuditLogsList] = useState<any[]>([
    { id: "log-1", userId: "Dr. John Sarwi", action: "ORGANIZATION_CREATED", description: "Created organization Mwenge Catholic University", ip: "192.168.1.10", timestamp: "2026-08-01 10:15" },
    { id: "log-2", userId: "Admin", action: "CANDIDATE_APPROVED", description: "Approved nomination for John Charles Sarwi (President)", ip: "192.168.1.15", timestamp: "2026-08-01 12:30" },
    { id: "log-3", userId: "Voter-992", action: "CAST_VOTE", description: "Successfully cast AES-256 encrypted ballot in Presidential Election", ip: "192.168.1.88", timestamp: "2026-08-02 09:45" },
    { id: "log-4", userId: "Admin", action: "CLUB_REGISTERED", description: "Registered Computing & IT Society club", ip: "192.168.1.10", timestamp: "2026-08-02 14:00" }
  ]);

  // User Roles & Permissions state
  const [adminRolesList, setAdminRolesList] = useState<any[]>([
    { id: 'role-1', name: 'Master Org Admin', description: 'Full administrative rights within organization', exportReports: true, readOnlyAuditLogs: false, candidateApproval: true, manageElections: true },
    { id: 'role-2', name: 'Assistant Registrar', description: 'Can approve candidates and manage voters', exportReports: true, readOnlyAuditLogs: true, candidateApproval: true, manageElections: false },
    { id: 'role-3', name: 'Compliance Auditor', description: 'Read-only access to audit logs and results', exportReports: false, readOnlyAuditLogs: true, candidateApproval: false, manageElections: false }
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleExport, setNewRoleExport] = useState(true);
  const [newRoleAudit, setNewRoleAudit] = useState(true);
  const [newRoleApprove, setNewRoleApprove] = useState(true);
  const [newRoleElections, setNewRoleElections] = useState(false);

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    const roleObj = {
      id: 'role-' + (adminRolesList.length + 1),
      name: newRoleName,
      description: newRoleDesc || 'Custom organization admin role',
      exportReports: newRoleExport,
      readOnlyAuditLogs: newRoleAudit,
      candidateApproval: newRoleApprove,
      manageElections: newRoleElections
    };
    setAdminRolesList([...adminRolesList, roleObj]);
    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Super Admin", action: "CUSTOM_ROLE_CREATED", description: `Defined custom role ${newRoleName}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
    setNewRoleName('');
    setNewRoleDesc('');
    alert(`Custom role "${newRoleName}" successfully created.`);
  };

  const toggleRolePermission = (roleId: string, permKey: string) => {
    setAdminRolesList(adminRolesList.map(r => {
      if (r.id === roleId) {
        return { ...r, [permKey]: !r[permKey] };
      }
      return r;
    }));
  };

  useEffect(() => {
    fetch('/api/results/live/el-1')
      .then(res => res.json())
      .then(d => setLiveData(d))
      .catch(e => console.error(e));
  }, []);

  // Handler to create organization with Super Admin checks
  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgEmail) return;
    const newOrg = {
      id: "org-" + (adminOrgs.length + 1),
      name: newOrgName,
      contactEmail: newOrgEmail,
      status: "ACTIVE",
      primaryColor: "#2563eb",
      createdAt: new Date().toISOString().split('T')[0],
      hasActiveElection: false,
      hasUnpaidSub: false,
      hasPendingApprovals: false
    };
    setAdminOrgs([...adminOrgs, newOrg]);
    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Super Admin", action: "ORGANIZATION_CREATED", description: `Created new organization ${newOrgName}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
    setNewOrgName('');
    setNewOrgEmail('');
    alert(`Organization "${newOrgName}" successfully created and provisioned.`);
  };

  // Handler for Organization Deletion Check
  const initiateOrgDelete = (org: any) => {
    let canDel = true;
    let reason = "This organization can now be deleted.";
    if (org.hasActiveElection) {
      canDel = false;
      reason = "Cannot delete: Active election is currently in progress.";
    } else if (org.hasUnpaidSub) {
      canDel = false;
      reason = "Cannot delete: Unpaid subscription invoice exists.";
    } else if (org.hasPendingApprovals) {
      canDel = false;
      reason = "Cannot delete: Pending candidate approvals require resolution.";
    }
    setOrgDeleteModal({ isOpen: true, org, confirmText: '', canDelete: canDel, reason });
  };

  // Archive Organization
  const toggleArchiveOrg = (id: string) => {
    setAdminOrgs(adminOrgs.map(o => {
      if (o.id === id) {
        const newStatus = o.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED';
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  const confirmDeleteOrg = () => {
    if (orgDeleteModal.confirmText !== 'DELETE') {
      alert("Please type 'DELETE' exactly to confirm permanent deletion.");
      return;
    }
    setAdminOrgs(adminOrgs.filter(o => o.id !== orgDeleteModal.org.id));
    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Super Admin", action: "ORGANIZATION_DELETED", description: `Permanently deleted organization ${orgDeleteModal.org.name}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
    setOrgDeleteModal({ isOpen: false, org: null, confirmText: '', canDelete: false, reason: '' });
    alert("Organization permanently deleted.");
  };

  // Club CRUD Handlers within Organization Context
  const handleOpenCreateClub = () => {
    setEditingClub(null);
    setClubForm({
      name: '',
      faculty: 'Faculty of Science & Technology',
      department: 'Computer Science',
      patron: '',
      email: '',
      category: 'Academic',
      organizationId: selectedOrgContext
    });
    setShowClubModal(true);
  };

  const handleOpenEditClub = (club: any) => {
    setEditingClub(club);
    setClubForm({
      name: club.name,
      faculty: club.faculty,
      department: club.department,
      patron: club.patron,
      email: club.email,
      category: club.category,
      organizationId: club.organizationId || selectedOrgContext
    });
    setShowClubModal(true);
  };

  const handleSaveClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubForm.name) return;
    if (editingClub) {
      setClubsList(clubsList.map(c => c.id === editingClub.id ? { ...c, ...clubForm } : c));
      setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Org Admin", action: "CLUB_UPDATED", description: `Updated club ${clubForm.name}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
      alert(`Club "${clubForm.name}" updated successfully.`);
    } else {
      const newClub = {
        id: "club-" + (clubsList.length + 1),
        ...clubForm,
        status: "ACTIVE"
      };
      setClubsList([...clubsList, newClub]);
      setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Org Admin", action: "CLUB_CREATED", description: `Registered new club ${clubForm.name}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
      alert(`Club "${clubForm.name}" registered successfully.`);
    }
    setShowClubModal(false);
  };

  const handleDeleteClub = (clubId: string) => {
    const club = clubsList.find(c => c.id === clubId);
    if (confirm(`Are you sure you want to delete club "${club?.name || clubId}"?`)) {
      setClubsList(clubsList.filter(c => c.id !== clubId));
      setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Org Admin", action: "CLUB_DELETED", description: `Deleted club ${club?.name}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
      alert("Club deleted successfully.");
    }
  };

  // Voter Portal Handlers
  const handleVoterRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterRegNumber || !voterFullName) {
      alert("Please enter both registration number and full name.");
      return;
    }
    setVoterRegistered(true);
    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: voterRegNumber, action: "VOTER_REGISTERED", description: `Voter ${voterFullName} (${voterRegNumber}) registered`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
    alert(`Voter ${voterFullName} successfully registered and verified for the active ballot session.`);
  };

  const handleCastVoterBallot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterChoiceId) {
      alert("Please select a candidate before casting your ballot.");
      return;
    }
    const receiptCode = "SV-REC-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setVoterReceipt(receiptCode);
    setVoterVoted(true);
    setCandidatesManagement(candidatesManagement.map(c => {
      if (c.id === voterChoiceId) {
        return { ...c, votesCount: c.votesCount + 1, hasReceivedVotes: true };
      }
      return c;
    }));
    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: voterRegNumber || "Voter", action: "CAST_VOTE", description: `Cast ballot with cryptoreceipt ${receiptCode}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
    alert(`Ballot successfully cast! Cryptographic receipt: ${receiptCode}`);
  };

  // Add Candidate Submission
  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandForm.fullName || !newCandForm.regNumber) {
      alert("Please enter candidate full name and registration number.");
      return;
    }
    const slug = newCandForm.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCand = {
      id: "cand-" + (candidatesManagement.length + 1),
      slug,
      ...newCandForm,
      approvalStatus: "Approved",
      candidateStatus: "Active",
      votesCount: 0,
      hasReceivedVotes: false,
      socials: { email: newCandForm.email || "candidate@mwecau.ac.tz" }
    };
    setCandidatesManagement([...candidatesManagement, newCand]);
    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Org Admin", action: "CANDIDATE_ADDED", description: `Added candidate ${newCandForm.fullName} for position ${newCandForm.position}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
    setShowAddCandidateModal(false);
    setNewCandForm({
      fullName: '', regNumber: '', gender: 'Male', email: '', phone: '',
      faculty: 'Faculty of Science & Technology', department: 'Computer Science', course: 'BSc Computer Science',
      yearOfStudy: 'Year 3', position: 'President', club: 'Computing & IT Society',
      biography: '', manifesto: '', slogan: ''
    });
    alert(`Candidate ${newCandForm.fullName} successfully added and approved!`);
  };

  // Remove Candidate with votes check
  const handleCandidateRemovalAction = (actionType: 'archive' | 'withdraw' | 'delete') => {
    const cand = removeCandidateModal.candidate;
    if (!cand) return;

    if (actionType === 'delete' && cand.hasReceivedVotes) {
      alert("Cannot permanently delete candidate: This candidate has already received votes in the election. You may Archive or Withdraw instead.");
      return;
    }

    if (actionType === 'archive') {
      setCandidatesManagement(candidatesManagement.map(c => c.id === cand.id ? { ...c, candidateStatus: 'Archived' } : c));
    } else if (actionType === 'withdraw') {
      setCandidatesManagement(candidatesManagement.map(c => c.id === cand.id ? { ...c, candidateStatus: 'Withdrawn', approvalStatus: 'Withdrawn' } : c));
    } else if (actionType === 'delete') {
      setCandidatesManagement(candidatesManagement.filter(c => c.id !== cand.id));
    }

    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Org Admin", action: `CANDIDATE_${actionType.toUpperCase()}`, description: `${actionType} candidate ${cand.fullName}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
    setRemoveCandidateModal({ isOpen: false, candidate: null });
    alert(`Candidate ${cand.fullName} has been successfully ${actionType}d.`);
  };

  // Bulk Import Simulator
  const handleBulkImport = () => {
    alert("Excel/CSV Bulk Upload Template successfully processed! 14 new candidates imported and validated.");
    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: "Org Admin", action: "BULK_CANDIDATE_IMPORT", description: "Imported 14 candidates via Excel CSV template", ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
  };

  // Filtered Candidates
  const filteredCandidates = candidatesManagement.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(candSearch.toLowerCase()) || c.regNumber.toLowerCase().includes(candSearch.toLowerCase());
    const matchesClub = candFilterClub === 'All' || c.club === candFilterClub;
    const matchesStatus = candFilterStatus === 'All' || c.candidateStatus === candFilterStatus;
    return matchesSearch && matchesClub && matchesStatus;
  });

  // Candidate Portal Form State
  const [candPortalForm, setCandPortalForm] = useState({
    fullName: '',
    regNumber: '',
    email: '',
    phone: '',
    faculty: 'Faculty of Science & Technology',
    department: 'Computer Science',
    course: 'BSc Computer Science',
    yearOfStudy: 'Year 3',
    position: 'President',
    electionId: 'el-1',
    club: 'Computing & IT Society',
    slogan: '',
    manifesto: '',
    photoUrl: ''
  });

  const handleCandidatePortalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candPortalForm.fullName || !candPortalForm.regNumber || !candPortalForm.electionId) {
      alert("Please fill in all required candidate registration fields.");
      return;
    }
    const newCandidate = {
      id: 'cand-' + (candidatesManagement.length + 1),
      slug: candPortalForm.fullName.toLowerCase().replace(/\s+/g, '-'),
      fullName: candPortalForm.fullName,
      regNumber: candPortalForm.regNumber,
      gender: 'Male',
      email: candPortalForm.email || 'candidate@mwecau.ac.tz',
      phone: candPortalForm.phone || '+255 700 000 000',
      faculty: candPortalForm.faculty,
      department: candPortalForm.department,
      course: candPortalForm.course,
      yearOfStudy: candPortalForm.yearOfStudy,
      position: candPortalForm.position,
      electionId: candPortalForm.electionId,
      club: candPortalForm.club,
      biography: candPortalForm.manifesto || 'Candidate manifesto and leadership vision.',
      manifesto: candPortalForm.manifesto || 'Commitment to student progress and transparency.',
      slogan: candPortalForm.slogan || 'Leadership with Integrity',
      campaignColor: '#2563eb',
      approvalStatus: 'Pending',
      candidateStatus: 'Active',
      votesCount: 0,
      hasReceivedVotes: false,
      photoUrl: candPortalForm.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      socials: { email: candPortalForm.email }
    };
    setCandidatesManagement([...candidatesManagement, newCandidate]);
    setAuditLogsList([{
      id: "log-" + (auditLogsList.length + 1),
      userId: candPortalForm.regNumber,
      organizationId: orgAuthUser.orgId,
      action: "CANDIDATE_APPLICATION_SUBMITTED",
      description: `Submitted candidacy for ${candPortalForm.fullName} (${candPortalForm.position}) in election ${candPortalForm.electionId}`,
      ip: "127.0.0.1",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }, ...auditLogsList]);
    alert(`Candidacy for "${candPortalForm.fullName}" successfully registered and submitted for Organization Admin approval!`);
    setActiveTab('candidate-management');
  };

  // Elections Management State per Organization
  const [electionsList, setElectionsList] = useState<any[]>([
    { id: 'el-1', organizationId: 'org-1', title: '2026 Student Union Presidential & Senatorial Election', startDate: '2026-08-01 08:00', endDate: '2026-08-05 18:00', status: 'ACTIVE' },
    { id: 'el-2', organizationId: 'org-1', title: 'Faculty of Science Representative Election', startDate: '2026-09-01 08:00', endDate: '2026-09-03 18:00', status: 'UPCOMING' }
  ]);
  const [showCreateElectionModal, setShowCreateElectionModal] = useState(false);
  const [newElectionForm, setNewElectionForm] = useState({
    title: '',
    startDate: '2026-08-10 08:00',
    endDate: '2026-08-15 18:00',
    status: 'ACTIVE'
  });

  const handleCreateElectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newElectionForm.title) {
      alert("Please enter a valid election title.");
      return;
    }
    const newEl = {
      id: 'el-' + (electionsList.length + 1),
      organizationId: orgAuthUser.orgId,
      title: newElectionForm.title,
      startDate: newElectionForm.startDate,
      endDate: newElectionForm.endDate,
      status: newElectionForm.status
    };
    setElectionsList([...electionsList, newEl]);
    setAuditLogsList([{ id: "log-" + (auditLogsList.length + 1), userId: orgAuthUser.email, organizationId: orgAuthUser.orgId, action: "ELECTION_CREATED", description: `Created new election: ${newElectionForm.title}`, ip: "127.0.0.1", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }, ...auditLogsList]);
    setShowCreateElectionModal(false);
    setNewElectionForm({ title: '', startDate: '2026-08-10 08:00', endDate: '2026-08-15 18:00', status: 'ACTIVE' });
    alert(`Election "${newElectionForm.title}" successfully created and published under organization "${orgAuthUser.orgName}".`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Header & Role Switcher */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-md">
              SV
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">SmartVote AI</h1>
              <p className="text-[11px] text-slate-500 font-mono">Enterprise Election Management & Campaign Suite</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
              <button
                onClick={() => { setCurrentRole('super-admin'); setActiveTab('org-management'); }}
                className={`px-3 py-1.5 rounded-lg transition ${currentRole === 'super-admin' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Super Admin
              </button>
              <button
                onClick={() => { setCurrentRole('org-admin'); setActiveTab('candidate-management'); }}
                className={`px-3 py-1.5 rounded-lg transition ${currentRole === 'org-admin' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Org Admin
              </button>
              <button
                onClick={() => { setCurrentRole('candidate'); setActiveTab('candidate-profile'); }}
                className={`px-3 py-1.5 rounded-lg transition ${currentRole === 'candidate' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Candidate Campaign Site
              </button>
            </div>

            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-700">System Secure</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Bar */}
      <nav className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex space-x-1 overflow-x-auto py-2.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('candidate-profile')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'candidate-profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Candidate Campaign Site (/candidate/john-charles-sarwi)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('org-login')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'org-login' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Org Login (/organization/login)</span>
          </button>

          <button
            onClick={() => setActiveTab('org-dashboard')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'org-dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Org Dashboard (/organization/dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('org-management')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'org-management' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Super Admin: Organizations</span>
          </button>

          <button
            onClick={() => setActiveTab('roles-permissions')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'roles-permissions' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Super Admin: Roles & Permissions</span>
          </button>

          <button
            onClick={() => setActiveTab('club-management')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'club-management' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Club Management</span>
          </button>

          <button
            onClick={() => setActiveTab('candidate-management')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'candidate-management' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Management & Approval</span>
          </button>

          <button
            onClick={() => setActiveTab('audit-logs')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'audit-logs' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Audit Logs & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('voter-portal')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'voter-portal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Vote className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voter Portal (Register & Vote)</span>
          </button>

          <button
            onClick={() => setActiveTab('candidate-portal')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'candidate-portal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Candidate Portal (/candidate/portal)</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        {/* ========================================================== */}
        {/* TAB X: CANDIDATE PORTAL (Registration & Photo Upload) */}
        {/* ========================================================== */}
        {activeTab === 'candidate-portal' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-mono font-bold">ONLINE CANDIDATE PORTAL</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Candidate Nomination & Registration</h2>
              <p className="text-sm text-slate-500">Register your candidacy for an active or upcoming election, submit your manifesto, upload your campaign photo, and submit for verification.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <form onSubmit={handleCandidatePortalSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Select Target Election *</label>
                    <select
                      value={candPortalForm.electionId}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, electionId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                    >
                      {electionsList.map(el => (
                        <option key={el.id} value={el.id}>{el.title} ({el.status})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Contesting Position *</label>
                    <select
                      value={candPortalForm.position}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, position: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                    >
                      <option value="President">President / Chairperson</option>
                      <option value="Vice President">Vice President</option>
                      <option value="General Secretary">General Secretary</option>
                      <option value="Treasurer">Treasurer</option>
                      <option value="Faculty Representative">Faculty Representative</option>
                      <option value="Senator">Senator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={candPortalForm.fullName}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, fullName: e.target.value })}
                      placeholder="e.g. Baraka Mwakyusa"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Student Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={candPortalForm.regNumber}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, regNumber: e.target.value })}
                      placeholder="e.g. CS/2024/099"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={candPortalForm.email}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, email: e.target.value })}
                      placeholder="candidate@university.ac.tz"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={candPortalForm.phone}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, phone: e.target.value })}
                      placeholder="+255 712 345 678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Faculty / Department</label>
                    <input
                      type="text"
                      value={candPortalForm.faculty}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, faculty: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Campaign Slogan</label>
                    <input
                      type="text"
                      value={candPortalForm.slogan}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, slogan: e.target.value })}
                      placeholder="e.g. Transparency, Progress & Unity"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Campaign Photo URL (or Image File)</label>
                    <input
                      type="text"
                      value={candPortalForm.photoUrl}
                      onChange={(e) => setCandPortalForm({ ...candPortalForm, photoUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... or upload"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Campaign Manifesto & Promises</label>
                  <textarea
                    rows={4}
                    value={candPortalForm.manifesto}
                    onChange={(e) => setCandPortalForm({ ...candPortalForm, manifesto: e.target.value })}
                    placeholder="Detail your campaign promises, developmental objectives, and manifesto highlights..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                  ></textarea>
                </div>

                <div className="p-4 bg-blue-50 text-blue-900 rounded-2xl border border-blue-200 space-y-1">
                  <p className="font-bold">ℹ️ Nomination Approval Workflow</p>
                  <p className="text-slate-600">Once submitted, your nomination will be queued for verification by the Organization Returning Officer. Upon approval, your profile and campaign manifestos will appear on the public voting portal.</p>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-blue-900 text-white font-bold rounded-2xl text-xs hover:bg-blue-800 transition shadow-lg flex items-center space-x-2"
                  >
                    <span>Submit Candidate Nomination</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 1: CANDIDATE CAMPAIGN WEBSITE (/candidate/john-charles-sarwi) */}
        {/* ========================================================== */}
        {activeTab === 'candidate-profile' && (
          <div className="space-y-10 animate-fadeIn">

            {/* Hero Cover Banner & Header */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-64 md:h-80 w-full relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 flex flex-col justify-between">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Top Badges */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>🟢 Campaign Active</span>
                    <span className="text-white/40">•</span>
                    <span className="text-amber-300">✓ Verified Candidate</span>
                  </div>
                  <div className="bg-blue-600/90 text-white px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider shadow-md">
                    SRC PRESIDENTIAL ELECTION 2026
                  </div>
                </div>

                {/* Slogan & Metadata */}
                <div className="relative z-10">
                  <p className="text-blue-300 text-xs font-mono uppercase tracking-widest mb-1">Mwenge Catholic University • Computing & IT Society</p>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">John Charles Sarwi</h1>
                  <p className="text-slate-200 text-sm md:text-base mt-2 max-w-2xl font-medium italic">"Innovation, Transparency & Uncompromising Student Welfare"</p>
                </div>
              </div>

              {/* Profile Bar & Quick Stats */}
              <div className="px-8 pb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 relative z-20">
                <div className="flex items-end space-x-6">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                    alt="John Charles Sarwi"
                    className="w-32 h-32 md:w-36 md:h-36 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                  />
                  <div className="pb-2">
                    <h2 className="text-xl font-bold text-slate-900">John Charles Sarwi</h2>
                    <p className="text-xs text-blue-600 font-semibold">BSc Computer Science • Year 3</p>
                    <p className="text-xs text-slate-500 mt-0.5">Faculty of Science & Technology</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-mono font-bold">Current Ranking</div>
                    <div className="text-xl font-black text-blue-900">#1 Spot</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-mono font-bold">Live Tally Votes</div>
                    <div className="text-xl font-black text-emerald-600">560 Votes (63.9%)</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('candidate-profile')}
                    className="px-6 py-3.5 bg-blue-900 text-white rounded-2xl text-xs font-bold hover:bg-blue-800 transition shadow-lg flex items-center space-x-2"
                  >
                    <Vote className="w-4 h-4" />
                    <span>Cast Secure Ballot</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Campaign Hero Card & Countdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                
                {/* About Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span>About John Charles Sarwi</span>
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    John Charles Sarwi is a visionary student leader and final-year Computer Science undergraduate at Mwenge Catholic University. With a proven track record in campus advocacy, technical innovation, and peer mentorship, John is running for Student Representative Council (SRC) President to champion digital transformation, equitable resource distribution, and 24/7 academic infrastructure.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Vision</span>
                      <p className="text-xs text-slate-800 font-medium">To build a connected, accountable, and technologically empowered student body prepared for the global digital economy.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Mission</span>
                      <p className="text-xs text-slate-800 font-medium">Advocating relentlessly for student welfare, 24/7 internet access, transparent financial reporting, and practical career incubators.</p>
                    </div>
                  </div>
                </div>

                {/* Modern Manifesto & Expandable Categories */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <span>Comprehensive Campaign Manifesto</span>
                    </h3>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">8 Key Pillars</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "1. Academic Infrastructure & 24/7 Wi-Fi", desc: "Upgrading campus fiber bandwidth, providing round-the-clock wireless internet access across all lecture halls and hostels." },
                      { title: "2. Technology Innovation Hub", desc: "Establishing an incubator lab equipped with modern workstations, IoT development kits, and AI mentorship programs." },
                      { title: "3. Transparent Student Budgeting", desc: "Implementing an open-ledger financial portal so every student union expenditure is fully auditable in real-time." },
                      { title: "4. Student Welfare & Health Grants", desc: "Expanding emergency medical assistance funds and subsidized cafeteria pricing for undergraduate scholars." },
                      { title: "5. Career Development & Industry Partnerships", desc: "Forging direct internship pipelines with East African tech corporations, banks, and auditing firms." }
                    ].map((pillar, idx) => (
                      <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 transition space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">{pillar.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Promises Cards */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Core Campaign Promises & Targets</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "High-Speed Hostel Wi-Fi", target: "First 100 Days", priority: "High Priority", progress: 90 },
                      { title: "Open Budget Dashboard", target: "Month 1 in Office", priority: "Critical", progress: 100 },
                      { title: "Annual MWECAU Hackathon", target: "November 2026", priority: "Medium", progress: 65 },
                      { title: "Modernized Computer Labs", target: "Semester 1", priority: "High Priority", progress: 80 }
                    ].map((promise, idx) => (
                      <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 text-xs">{promise.title}</h4>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">{promise.priority}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Target Completion: <span className="font-semibold text-slate-700">{promise.target}</span></p>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${promise.progress}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Awards, Certifications & Leadership</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Best Student Developer 2025", org: "Tanzania ICT Commission", desc: "Awarded first place for building national student health tracking app." },
                      { title: "SRC Academic Secretary", org: "MWECAU Student Union", desc: "Successfully lobbied for extended library hours during exam periods." },
                      { title: "Google DSC Lead", org: "Google Developer Student Clubs", desc: "Organized 12 bootcamps training 500+ students in cloud and mobile engineering." },
                      { title: "Hackathon Winner", org: "East Africa HackFest", desc: "Led team of 4 to build decentralized voting simulator prototype." }
                    ].map((ach, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-900 text-xs">{ach.title}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{ach.org}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{ach.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar: Live Status, Countdown & Document Center */}
              <div className="space-y-8">
                
                {/* Live Election Status Widget */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h4 className="font-bold text-sm flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>Live Election Tally</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full font-mono border border-emerald-800">SOCKET.IO CONNECTED</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>John Charles Sarwi (#1)</span>
                        <span className="text-emerald-400">560 votes (63.9%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '63.9%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Peter Joseph (#2)</span>
                        <span className="text-slate-400">316 votes (36.1%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '36.1%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-xs space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Total Votes Cast:</span>
                      <span className="font-bold text-white">876 / 1,250</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Turnout Rate:</span>
                      <span className="font-bold text-emerald-400">70.08%</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Polls Close:</span>
                      <span className="font-bold text-amber-300">Aug 5, 2026 • 23:59</span>
                    </div>
                  </div>
                </div>

                {/* Document Center */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span>Official Document Center</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: "John_Sarwi_Manifesto_2026.pdf", size: "2.4 MB" },
                      { name: "Official_Academic_CV_2026.pdf", size: "1.1 MB" },
                      { name: "IT_Infrastructure_Audit_Report.pdf", size: "4.8 MB" }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-blue-300 transition">
                        <div className="flex items-center space-x-3 truncate">
                          <FileText className="w-4 h-4 text-red-500 shrink-0" />
                          <div className="truncate">
                            <p className="font-bold text-slate-800 truncate">{doc.name}</p>
                            <p className="text-[10px] text-slate-400">{doc.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Downloading ${doc.name}...`)}
                          className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-100 transition text-slate-600"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Timeline */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Campaign Timeline</span>
                  </h4>
                  <div className="space-y-4 border-l-2 border-blue-200 pl-4 ml-2 text-xs">
                    {[
                      { date: "July 15, 2026", title: "Campaign Launch & Nomination Approval", status: "Completed" },
                      { date: "July 20, 2026", title: "Manifesto Publication & Hostel Tours", status: "Completed" },
                      { date: "July 28, 2026", title: "SRC Presidential Debate at Great Hall", status: "Completed" },
                      { date: "August 1, 2026", title: "Polling Begins (Active Vote Window)", status: "In Progress" },
                      { date: "August 5, 2026", title: "Election Conclusion & Certified Results", status: "Upcoming" }
                    ].map((t, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
                        <p className="text-[10px] text-blue-600 font-bold font-mono">{t.date}</p>
                        <p className="font-bold text-slate-900">{t.title}</p>
                        <p className="text-[11px] text-slate-500">{t.status}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links & Contact */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>Connect & Social Channels</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <a href="#facebook" onClick={(e) => e.preventDefault()} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-2 hover:bg-slate-100 transition text-slate-700">
                      <span>Facebook</span>
                    </a>
                    <a href="#instagram" onClick={(e) => e.preventDefault()} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-2 hover:bg-slate-100 transition text-slate-700">
                      <span>Instagram</span>
                    </a>
                    <a href="#linkedin" onClick={(e) => e.preventDefault()} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-2 hover:bg-slate-100 transition text-slate-700">
                      <span>LinkedIn</span>
                    </a>
                    <a href="#email" onClick={(e) => e.preventDefault()} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-2 hover:bg-slate-100 transition text-slate-700">
                      <span>Email Us</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: SUPER ADMIN ORGANIZATION MANAGEMENT */}
        {/* ========================================================== */}
        {activeTab === 'org-management' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Super Admin: Organization & Tenant Management</h2>
                <p className="text-xs text-slate-500 mt-1">Manage master tenant universities, subscriptions, archiving, and safety-verified deletions.</p>
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono">
                ROLE: SUPER_ADMIN (Global Privileges)
              </div>
            </div>

            {/* Create Organization Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Provision New Tenant Organization</span>
              </h3>
              <form onSubmit={handleCreateOrg} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="e.g. University of Dodoma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={newOrgEmail}
                    onChange={(e) => setNewOrgEmail(e.target.value)}
                    placeholder="admin@udom.ac.tz"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition shadow-sm"
                  >
                    Provision Organization
                  </button>
                </div>
              </form>
            </div>

            {/* Organizations Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-base">Registered Tenant Organizations ({adminOrgs.length})</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Organization Name</th>
                      <th className="px-6 py-4">Contact Email</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {adminOrgs.map(org => (
                      <tr key={org.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-bold text-slate-900">{org.name}</td>
                        <td className="px-6 py-4 text-slate-600">{org.contactEmail}</td>
                        <td className="px-6 py-4 text-slate-500">{org.createdAt}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            org.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {org.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => toggleArchiveOrg(org.id)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition font-semibold"
                          >
                            {org.status === 'ARCHIVED' ? 'Restore' : 'Archive'}
                          </button>
                          <button
                            onClick={() => initiateOrgDelete(org)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delete Verification Modal */}
            {orgDeleteModal.isOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 border border-slate-200 animate-fadeIn">
                  <div className="flex items-center space-x-3 text-red-600">
                    <AlertTriangle className="w-8 h-8 shrink-0" />
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900">Organization Deletion Check</h4>
                      <p className="text-xs text-slate-500">Target: {orgDeleteModal.org?.name}</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl text-xs font-semibold ${orgDeleteModal.canDelete ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                    {orgDeleteModal.reason}
                  </div>

                  {orgDeleteModal.canDelete && (
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                        <p className="font-bold text-slate-900">⚠️ WARNING: This action cannot be undone.</p>
                        <p>Permanently removes all clubs, elections, candidates, voters, results, reports, and uploaded files.</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Type "DELETE" to confirm:</label>
                        <input
                          type="text"
                          value={orgDeleteModal.confirmText}
                          onChange={(e) => setOrgDeleteModal({ ...orgDeleteModal, confirmText: e.target.value })}
                          placeholder="DELETE"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setOrgDeleteModal({ isOpen: false, org: null, confirmText: '', canDelete: false, reason: '' })}
                      className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                    {orgDeleteModal.canDelete && (
                      <button
                        onClick={confirmDeleteOrg}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition shadow-sm"
                      >
                        Permanently Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: CLUB MANAGEMENT */}
        {/* ========================================================== */}
        {activeTab === 'club-management' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Club & Departmental Society Management</h2>
                <p className="text-xs text-slate-500 mt-1">Full CRUD control for Organization Admins to create, edit, and delete clubs within their organization context.</p>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedOrgContext}
                  onChange={(e) => setSelectedOrgContext(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 shadow-sm focus:outline-none"
                >
                  {adminOrgs.map(org => (
                    <option key={org.id} value={org.id}>Org Context: {org.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleOpenCreateClub}
                  className="px-5 py-3 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition shadow-sm flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register New Club</span>
                </button>
              </div>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clubsList.filter(club => !club.organizationId || club.organizationId === selectedOrgContext).map(club => (
                <div key={club.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200">{club.category}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{club.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{club.faculty} • {club.department}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-600"><span className="font-bold">Patron:</span> {club.patron}</p>
                    <p className="text-slate-600"><span className="font-bold">Email:</span> {club.email}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenEditClub(club)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClub(club.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                    <button
                      onClick={() => alert(`Managing elections for ${club.name}`)}
                      className="px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition"
                    >
                      Elections
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Club Create / Edit Modal */}
            {showClubModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 border border-slate-200 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">{editingClub ? 'Edit Club Details' : 'Register New Club'}</h3>
                    <button onClick={() => setShowClubModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveClubSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Club Name</label>
                      <input
                        type="text"
                        required
                        value={clubForm.name}
                        onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                        placeholder="e.g. Artificial Intelligence Club"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Faculty</label>
                        <input
                          type="text"
                          required
                          value={clubForm.faculty}
                          onChange={(e) => setClubForm({ ...clubForm, faculty: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Department</label>
                        <input
                          type="text"
                          required
                          value={clubForm.department}
                          onChange={(e) => setClubForm({ ...clubForm, department: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Faculty Patron</label>
                        <input
                          type="text"
                          required
                          value={clubForm.patron}
                          onChange={(e) => setClubForm({ ...clubForm, patron: e.target.value })}
                          placeholder="Dr. John Doe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                        <input
                          type="email"
                          required
                          value={clubForm.email}
                          onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
                          placeholder="club@mwecau.ac.tz"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={clubForm.category}
                        onChange={(e) => setClubForm({ ...clubForm, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Professional">Professional</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowClubModal(false)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-900 text-white rounded-xl font-bold shadow-sm hover:bg-blue-800 transition"
                      >
                        {editingClub ? 'Save Changes' : 'Register Club'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: CANDIDATE MANAGEMENT & APPROVAL */}
        {/* ========================================================== */}
        {activeTab === 'candidate-management' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Candidate Nominations & Management</h2>
                <p className="text-xs text-slate-500 mt-1">Approve, reject, withdraw, or archive candidates with strict vote-integrity checks.</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBulkImport}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition shadow-sm flex items-center space-x-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Bulk Import (Excel/CSV)</span>
                </button>
                <button
                  onClick={() => setShowAddCandidateModal(true)}
                  className="px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition shadow-sm flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Candidate</span>
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={candSearch}
                  onChange={(e) => setCandSearch(e.target.value)}
                  placeholder="Search by candidate name or registration number..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={candFilterStatus}
                  onChange={(e) => setCandFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">Reg Number</th>
                      <th className="px-6 py-4">Position & Club</th>
                      <th className="px-6 py-4">Approval Status</th>
                      <th className="px-6 py-4">Votes Tally</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredCandidates.map(cand => (
                      <tr key={cand.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0">
                            {cand.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{cand.fullName}</div>
                            <div className="text-[11px] text-slate-500">{cand.course}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">{cand.regNumber}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{cand.position}</div>
                          <div className="text-[11px] text-slate-500">{cand.club}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            cand.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {cand.approvalStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-blue-600">{cand.votesCount} votes</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => setRemoveCandidateModal({ isOpen: true, candidate: cand })}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-semibold"
                          >
                            Manage / Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Candidate Modal */}
            {showAddCandidateModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">Add New Candidate Nomination</h3>
                    <button onClick={() => setShowAddCandidateModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <form onSubmit={handleAddCandidateSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newCandForm.fullName}
                          onChange={(e) => setNewCandForm({ ...newCandForm, fullName: e.target.value })}
                          placeholder="John Charles Sarwi"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Registration Number</label>
                        <input
                          type="text"
                          required
                          value={newCandForm.regNumber}
                          onChange={(e) => setNewCandForm({ ...newCandForm, regNumber: e.target.value })}
                          placeholder="CS/2024/001"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={newCandForm.email}
                          onChange={(e) => setNewCandForm({ ...newCandForm, email: e.target.value })}
                          placeholder="john@mwecau.ac.tz"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Position</label>
                        <select
                          value={newCandForm.position}
                          onChange={(e) => setNewCandForm({ ...newCandForm, position: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold"
                        >
                          <option value="President">President</option>
                          <option value="Vice President">Vice President</option>
                          <option value="Secretary General">Secretary General</option>
                          <option value="Treasurer">Treasurer</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Campaign Slogan</label>
                      <input
                        type="text"
                        value={newCandForm.slogan}
                        onChange={(e) => setNewCandForm({ ...newCandForm, slogan: e.target.value })}
                        placeholder="Innovation & Transparency"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Campaign Manifesto</label>
                      <textarea
                        rows={4}
                        value={newCandForm.manifesto}
                        onChange={(e) => setNewCandForm({ ...newCandForm, manifesto: e.target.value })}
                        placeholder="Detail the candidate's core manifesto pillars..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                      ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowAddCandidateModal(false)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-900 text-white rounded-xl font-bold shadow-sm hover:bg-blue-800 transition"
                      >
                        Submit & Approve Candidate
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Remove / Withdraw Candidate Modal with Votes Check */}
            {removeCandidateModal.isOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 border border-slate-200 animate-fadeIn">
                  <div className="flex items-center space-x-3 text-amber-600">
                    <AlertTriangle className="w-8 h-8 shrink-0" />
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900">Manage Candidate</h4>
                      <p className="text-xs text-slate-500">{removeCandidateModal.candidate?.fullName}</p>
                    </div>
                  </div>

                  {removeCandidateModal.candidate?.hasReceivedVotes && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-semibold text-amber-800">
                      ⚠️ "This candidate already received votes ({removeCandidateModal.candidate?.votesCount})." Permanent deletion is blocked to preserve election history. You may Archive or mark as Withdrawn.
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => handleCandidateRemovalAction('archive')}
                      className="w-full py-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 transition text-left px-4 flex justify-between items-center"
                    >
                      <span>Archive Candidate</span>
                      <Archive className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleCandidateRemovalAction('withdraw')}
                      className="w-full py-3 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold hover:bg-blue-100 transition text-left px-4 flex justify-between items-center"
                    >
                      <span>Mark as Withdrawn</span>
                      <ShieldAlert className="w-4 h-4 text-blue-500" />
                    </button>
                    {!removeCandidateModal.candidate?.hasReceivedVotes && (
                      <button
                        onClick={() => handleCandidateRemovalAction('delete')}
                        className="w-full py-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100 transition text-left px-4 flex justify-between items-center"
                      >
                        <span>Permanently Delete</span>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setRemoveCandidateModal({ isOpen: false, candidate: null })}
                      className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB: SUPER ADMIN ROLES & PERMISSIONS */}
        {/* ========================================================== */}
        {activeTab === 'roles-permissions' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">User Roles & Granular Permissions</h2>
                <p className="text-xs text-slate-500 mt-1">Define custom administrative roles for Organization Admins and toggle specific access rights (e.g. export reports vs. read-only audit logs).</p>
              </div>
              <div className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono">
                SECURITY LEVEL: RBAC MASTER CONFIG
              </div>
            </div>

            {/* Create Custom Role Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Create New Custom Role</span>
              </h3>
              <form onSubmit={handleCreateCustomRole} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Role Name</label>
                    <input
                      type="text"
                      required
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="e.g. Senior Returning Officer"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={newRoleDesc}
                      onChange={(e) => setNewRoleDesc(e.target.value)}
                      placeholder="e.g. Manages vote tallying and candidate verifications"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <label className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoleExport}
                      onChange={(e) => setNewRoleExport(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-700">Export Reports</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoleAudit}
                      onChange={(e) => setNewRoleAudit(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-700">Read-Only Audit Logs</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoleApprove}
                      onChange={(e) => setNewRoleApprove(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-700">Candidate Approval</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoleElections}
                      onChange={(e) => setNewRoleElections(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-700">Manage Elections</span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition shadow-sm"
                  >
                    Save Custom Role Definition
                  </button>
                </div>
              </form>
            </div>

            {/* Roles Matrix Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-base">Configured Custom Roles & Access Rights ({adminRolesList.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Role Title</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-center">Export Reports</th>
                      <th className="px-6 py-4 text-center">Read-Only Audit</th>
                      <th className="px-6 py-4 text-center">Candidate Approval</th>
                      <th className="px-6 py-4 text-center">Manage Elections</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {adminRolesList.map(role => (
                      <tr key={role.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-bold text-slate-900">{role.name}</td>
                        <td className="px-6 py-4 text-slate-600">{role.description}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleRolePermission(role.id, 'exportReports')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition ${role.exportReports ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                          >
                            {role.exportReports ? 'ENABLED' : 'DISABLED'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleRolePermission(role.id, 'readOnlyAuditLogs')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition ${role.readOnlyAuditLogs ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                          >
                            {role.readOnlyAuditLogs ? 'ENABLED' : 'DISABLED'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleRolePermission(role.id, 'candidateApproval')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition ${role.candidateApproval ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                          >
                            {role.candidateApproval ? 'ENABLED' : 'DISABLED'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleRolePermission(role.id, 'manageElections')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition ${role.manageElections ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                          >
                            {role.manageElections ? 'ENABLED' : 'DISABLED'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: AUDIT LOGS & SECURITY */}
        {/* ========================================================== */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Immutable Audit Logs & Security Compliance</h2>
              <p className="text-xs text-slate-500 mt-1">Every administrative override, candidate approval, and vote cast is cryptographically recorded.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-base">Security Audit Trail ({auditLogsList.length} events)</h3>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">SHA-256 Verified</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Actor</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {auditLogsList.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{log.userId}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-[10px] font-mono font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{log.description}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 6: VOTER PORTAL (REGISTER & CAST VOTE) */}
        {/* ========================================================== */}
        {activeTab === 'voter-portal' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-4">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-mono">
                <Vote className="w-4 h-4" />
                <span>OFFICIAL SECURE VOTER PORTAL</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Student & Member Voting Portal</h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">Register with your student registration number and securely cast your vote for candidates uploaded and approved by Organization Admins.</p>
            </div>

            {!voterRegistered ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-bold text-slate-900 text-base">Voter Registration & Verification</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Enter your official credentials to unlock the secure digital ballot box.</p>
                </div>

                <form onSubmit={handleVoterRegister} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Registration / Student Number</label>
                    <input
                      type="text"
                      required
                      value={voterRegNumber}
                      onChange={(e) => setVoterRegNumber(e.target.value)}
                      placeholder="e.g. CS/2024/099"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={voterFullName}
                      onChange={(e) => setVoterFullName(e.target.value)}
                      placeholder="e.g. Grace Mwakyusa"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
                    <input
                      type="email"
                      required
                      value={voterEmail}
                      onChange={(e) => setVoterEmail(e.target.value)}
                      placeholder="e.g. grace@mwecau.ac.tz"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition shadow-sm"
                    >
                      Verify & Access Secure Ballot
                    </button>
                  </div>
                </form>
              </div>
            ) : !voterVoted ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Active Ballot: Student Union Presidency</h3>
                    <p className="text-xs text-slate-500">Authenticated Voter: <span className="font-bold text-slate-900">{voterFullName} ({voterRegNumber})</span></p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono font-bold text-[11px]">STATUS: ELIGIBLE TO VOTE</span>
                </div>

                <form onSubmit={handleCastVoterBallot} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {candidatesManagement.filter(c => c.approvalStatus === 'Approved' && c.candidateStatus === 'Active').map(cand => (
                      <label
                        key={cand.id}
                        className={`p-6 rounded-3xl border-2 transition cursor-pointer flex flex-col justify-between space-y-4 ${
                          voterChoiceId === cand.id ? 'border-blue-600 bg-blue-50/40 shadow-md' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-base">
                              {cand.fullName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{cand.fullName}</h4>
                              <p className="text-xs text-slate-500 font-mono">{cand.regNumber}</p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="voterChoice"
                            value={cand.id}
                            checked={voterChoiceId === cand.id}
                            onChange={() => setVoterChoiceId(cand.id)}
                            className="w-4 h-4 text-blue-600 mt-1"
                          />
                        </div>

                        <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs space-y-1">
                          <p className="text-slate-700 font-medium">Position: <span className="font-bold">{cand.position}</span></p>
                          <p className="text-slate-600 italic">"{cand.slogan || 'Committed to excellence'}"</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center space-x-3">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <p>Once you cast your ballot, your vote is encrypted via AES-256 and cannot be modified or re-cast. A unique cryptographic verification receipt will be issued.</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition shadow-sm"
                    >
                      Cast Secure Ballot Now
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">Vote Successfully Recorded!</h3>
                  <p className="text-xs text-slate-500">Your encrypted ballot has been securely written to the immutable election ledger.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono space-y-1">
                  <span className="text-slate-500 block">Cryptographic Receipt Code:</span>
                  <span className="text-base font-bold text-blue-700">{voterReceipt}</span>
                </div>
                <button
                  onClick={() => {
                    setVoterVoted(false);
                    setVoterChoiceId('');
                  }}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition"
                >
                  Return to Portal / Check Results
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB: ORGANIZATION LOGIN (/organization/login) */}
        {/* ========================================================== */}
        {activeTab === 'org-login' && (
          <div className="max-w-md mx-auto py-12 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto font-bold text-xl shadow-md">
                  SV
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Organization Secure Portal</h2>
                <p className="text-xs text-slate-500">Log in to your private multi-tenant organization dashboard with RBAC enforcement.</p>
              </div>

              <form onSubmit={handleOrgLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Organization</label>
                  <select
                    value={orgLoginOrgId}
                    onChange={(e) => setOrgLoginOrgId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-800"
                  >
                    {adminOrgs.map(org => (
                      <option key={org.id} value={org.id}>{org.name} ({org.status})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email or Username</label>
                  <input
                    type="text"
                    required
                    value={orgLoginEmail}
                    onChange={(e) => setOrgLoginEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secure Password (Bcrypt Hashed)</label>
                  <input
                    type="password"
                    required
                    value={orgLoginPassword}
                    onChange={(e) => setOrgLoginPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={orgLoginRole}
                    onChange={(e: any) => setOrgLoginRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-800"
                  >
                    <option value="ORGANIZATION_ADMIN">ORGANIZATION_ADMIN (Full Tenant Control)</option>
                    <option value="ORGANIZATION_MANAGER">ORGANIZATION_MANAGER (Assist Admin & Voters)</option>
                    <option value="ELECTION_OFFICER">ELECTION_OFFICER (Manage Voting & Verify)</option>
                    <option value="VIEWER">VIEWER (Read-Only Access)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-slate-600 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>Remember Me (Secure Cookie)</span>
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset token sent to registered organizational email."); }} className="text-blue-600 font-semibold hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition shadow-md flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authenticate & Enter Dashboard</span>
                  </button>
                </div>
              </form>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">Security Note:</p>
                <p>Every request is validated against tenant ID headers and JWT signature verification. Cross-tenant queries return 403 Forbidden.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB: ORGANIZATION PRIVATE DASHBOARD (/organization/dashboard) */}
        {/* ========================================================== */}
        {activeTab === 'org-dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Tenant Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-mono text-[11px] font-bold">
                    TENANT ID: {orgAuthUser.orgId}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full font-mono text-[11px] font-bold">
                    ROLE: {orgAuthUser.role}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold">{orgAuthUser.orgName} — Private Dashboard</h2>
                <p className="text-xs text-slate-300 font-mono">Logged in as: {orgAuthUser.email} | Session JWT Active</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => alert("Organization security profile updated successfully.")}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition backdrop-blur-sm"
                >
                  Security Settings
                </button>
                <button
                  onClick={handleOrgLogout}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Dashboard Sub-Navigation Tabs */}
            <div className="flex space-x-2 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
              {[
                { id: 'overview', label: 'Overview & Stats', icon: BarChart3 },
                { id: 'elections', label: 'Elections', icon: Vote },
                { id: 'candidates', label: 'Candidates', icon: Users },
                { id: 'voters', label: 'Voters', icon: UserCheck },
                { id: 'campaigns', label: 'Campaign Materials', icon: FileCheck },
                { id: 'reports', label: 'Reports & Analytics', icon: Download },
                { id: 'audit-logs', label: 'Tenant Audit Logs', icon: Activity },
                { id: 'settings', label: 'Organization Settings', icon: Building2 },
              ].map(sub => {
                const IconComponent = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setOrgDashboardSubTab(sub.id as any)}
                    className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 whitespace-nowrap ${orgDashboardSubTab === sub.id ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab 1: Overview */}
            {orgDashboardSubTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase font-mono">Active Elections</p>
                    <h3 className="text-3xl font-extrabold text-slate-900">1</h3>
                    <p className="text-[11px] text-emerald-600 font-semibold">● Live Ballot Box Open</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase font-mono">Total Candidates</p>
                    <h3 className="text-3xl font-extrabold text-slate-900">{candidatesManagement.length}</h3>
                    <p className="text-[11px] text-blue-600 font-semibold">All Approved & Verified</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase font-mono">Registered Voters</p>
                    <h3 className="text-3xl font-extrabold text-slate-900">1,420</h3>
                    <p className="text-[11px] text-indigo-600 font-semibold">94% Turnout Capacity</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase font-mono">Total Votes Cast</p>
                    <h3 className="text-3xl font-extrabold text-slate-900">876</h3>
                    <p className="text-[11px] text-emerald-600 font-semibold">Encrypted via AES-256</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-base">Tenant Data Isolation Verification</h3>
                    <p className="text-xs text-slate-500">Database queries are automatically filtered by WHERE organization_id = '{orgAuthUser.orgId}'. No records from other universities or organizations can be accessed or viewed.</p>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs space-y-2 text-slate-700">
                      <p className="font-bold text-blue-900">SELECT * FROM elections WHERE organization_id = '{orgAuthUser.orgId}' AND status = 'ACTIVE';</p>
                      <p className="text-slate-500">// Returns 1 active presidential election for {orgAuthUser.orgName}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-base">Quick Actions</h3>
                    <div className="space-y-2 text-xs">
                      <button onClick={() => setOrgDashboardSubTab('candidates')} className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-900 rounded-xl font-semibold transition flex items-center justify-between">
                        <span>Manage Candidates</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => setOrgDashboardSubTab('voters')} className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-900 rounded-xl font-semibold transition flex items-center justify-between">
                        <span>Verify Voter Register</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => setOrgDashboardSubTab('reports')} className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-900 rounded-xl font-semibold transition flex items-center justify-between">
                        <span>Export Certified Reports</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Elections */}
            {orgDashboardSubTab === 'elections' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Organization Elections ({orgAuthUser.orgName})</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Manage polling windows, returning officers, and secure ballot parameters.</p>
                  </div>
                  <button onClick={() => setShowCreateElectionModal(true)} className="px-4 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create New Election</span>
                  </button>
                </div>
                <div className="space-y-4 text-xs">
                  {electionsList.filter(el => !el.organizationId || el.organizationId === orgAuthUser.orgId).map(el => (
                    <div key={el.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] font-mono ${el.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {el.status}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1.5">{el.title}</h4>
                        <p className="text-slate-500 mt-0.5 font-mono">Polling Window: {el.startDate} — {el.endDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => alert(`Viewing live ballot analytics for ${el.title}`)} className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100">Analytics</button>
                        <button onClick={() => alert(`Managing settings for ${el.title}`)} className="px-3.5 py-2 bg-blue-900 text-white rounded-xl font-semibold">Settings</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Create Election Modal */}
            {showCreateElectionModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 border border-slate-200 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">Create New Election ({orgAuthUser.orgName})</h3>
                    <button onClick={() => setShowCreateElectionModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateElectionSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Election Title</label>
                      <input
                        type="text"
                        required
                        value={newElectionForm.title}
                        onChange={(e) => setNewElectionForm({ ...newElectionForm, title: e.target.value })}
                        placeholder="e.g. 2026 Faculty Representatives Election"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Start Date & Time</label>
                        <input
                          type="text"
                          required
                          value={newElectionForm.startDate}
                          onChange={(e) => setNewElectionForm({ ...newElectionForm, startDate: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">End Date & Time</label>
                        <input
                          type="text"
                          required
                          value={newElectionForm.endDate}
                          onChange={(e) => setNewElectionForm({ ...newElectionForm, endDate: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status</label>
                      <select
                        value={newElectionForm.status}
                        onChange={(e) => setNewElectionForm({ ...newElectionForm, status: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold"
                      >
                        <option value="ACTIVE">ACTIVE (Polling Open)</option>
                        <option value="UPCOMING">UPCOMING (Scheduled)</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowCreateElectionModal(false)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-900 text-white rounded-xl font-bold shadow-sm hover:bg-blue-800 transition"
                      >
                        Publish Election
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Candidates */}
            {orgDashboardSubTab === 'candidates' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Organization Candidates ({candidatesManagement.length})</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Candidates registered and approved under {orgAuthUser.orgName}.</p>
                  </div>
                  <button onClick={() => setActiveTab('candidate-management')} className="px-4 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition">
                    Go to Candidate Approvals
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {candidatesManagement.map(c => (
                    <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{c.fullName}</h4>
                        <p className="text-slate-500 font-mono">{c.regNumber} • {c.position}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] font-mono">{c.approvalStatus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Voters */}
            {orgDashboardSubTab === 'voters' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Registered Voter Directory</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Verified institutional voter rolls for {orgAuthUser.orgName}.</p>
                  </div>
                  <button onClick={() => alert("Voter CSV batch import wizard opened.")} className="px-4 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition">
                    Import Voter CSV
                  </button>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-700">Total Registered Voters: 1,420</p>
                  <p className="text-slate-500">Voter Authentication Mode: University ID / Registration Number Match + Institutional Email OTP</p>
                </div>
              </div>
            )}

            {/* Sub-Tab 5: Campaigns */}
            {orgDashboardSubTab === 'campaigns' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Campaign Materials & Manifestos</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Manage official candidate posters, manifesto files, and media briefs.</p>
                  </div>
                  <button onClick={() => alert("New campaign asset uploaded.")} className="px-4 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition">
                    Upload Campaign Asset
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-800">Presidential Manifesto 2026.pdf</p>
                    <p className="text-slate-500">Uploaded by John C. Sarwi</p>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">APPROVED</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-800">IT Society Campaign Brochure.pdf</p>
                    <p className="text-slate-500">Uploaded by Peter Joseph</p>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">APPROVED</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 6: Reports */}
            {orgDashboardSubTab === 'reports' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-bold text-slate-900 text-base">Certified Election Reports & Analytics</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Download tamper-evident PDF reports and CSV ballot tallies.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Certified Tally Report (PDF)</h4>
                      <p className="text-slate-500 mt-0.5">Includes cryptographic hashes and auditor sign-off</p>
                    </div>
                    <button onClick={() => alert("Downloading certified PDF report...")} className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800">
                      Download PDF
                    </button>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Raw Ballot Ledger (CSV)</h4>
                      <p className="text-slate-500 mt-0.5">Anonymized cryptographic receipt log</p>
                    </div>
                    <button onClick={() => alert("Downloading CSV ballot ledger...")} className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800">
                      Download CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 7: Audit Logs */}
            {orgDashboardSubTab === 'audit-logs' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-base">Tenant Audit Logs ({orgAuthUser.orgName})</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Immutable activity stream scoped to organization ID {orgAuthUser.orgId}.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4 font-mono">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {auditLogsList.filter(l => !l.organizationId || l.organizationId === orgAuthUser.orgId).map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4 font-mono text-slate-500">{log.timestamp}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{log.userId}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-mono text-[10px] font-bold">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{log.description}</td>
                          <td className="px-6 py-4 font-mono text-slate-500">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Tab 8: Settings */}
            {orgDashboardSubTab === 'settings' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-bold text-slate-900 text-base">Organization Profile & Settings</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage branding, official contact details, and institutional parameters.</p>
                </div>
                <div className="space-y-4 text-xs max-w-xl">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Organization Name</label>
                    <input type="text" defaultValue={orgAuthUser.orgName} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Administrative Email</label>
                    <input type="email" defaultValue={orgAuthUser.email} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tenant ID (Read-Only)</label>
                    <input type="text" disabled defaultValue={orgAuthUser.orgId} className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 font-mono text-slate-500" />
                  </div>
                  <div className="pt-2">
                    <button onClick={() => alert("Organization settings saved successfully.")} className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-6 text-center text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© 2026 SmartVote AI Enterprise Election Platform. All rights reserved.</div>
          <div className="flex space-x-6 text-slate-400 font-mono text-[11px]">
            <span>TENANT_ISOLATION: STRICT</span>
            <span>ENCRYPTION: AES-256</span>
            <span>STATUS: 99.99% UPTIME</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
