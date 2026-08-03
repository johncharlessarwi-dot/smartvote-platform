import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI if key exists
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// Architecture metadata & documentation payload
const architectureData = {
  projectName: "SmartVote AI Election Management System",
  version: "1.0.0-enterprise",
  architectureType: "Cloud-Native Microservices & Multi-Tenant SaaS",
  services: [
    {
      id: "auth-service",
      name: "Authentication Service",
      port: 3001,
      tech: "NestJS + Passport.js + JWT",
      responsibilities: ["User registration & login", "JWT access & refresh token generation", "Bcrypt password hashing (salt=12)", "RBAC permission enforcement"]
    },
    {
      id: "org-service",
      name: "Organization Service",
      port: 3002,
      tech: "NestJS + Prisma + PostgreSQL",
      responsibilities: ["Tenant (University/Company) management", "Custom branding (logo, primaryColor)", "Organization admin hierarchy", "Subscription & billing tier control"]
    },
    {
      id: "election-service",
      name: "Election Service",
      port: 3003,
      tech: "NestJS + Prisma",
      responsibilities: ["Election lifecycle (Draft -> Pending -> Active -> Completed)", "Club & Department structuring", "Position creation (President, Treasurer, etc.)", "Time-bound ballot scheduling"]
    },
    {
      id: "candidate-service",
      name: "Candidate Service",
      port: 3004,
      tech: "NestJS + Prisma",
      responsibilities: ["Candidate nominations & applications", "Manifesto & campaign profile management", "Approval workflow (Pending -> Approved/Rejected)", "Department & year verification"]
    },
    {
      id: "voting-service",
      name: "Voting Service",
      port: 3005,
      tech: "NestJS + Redis + PostgreSQL",
      responsibilities: ["Voter eligibility verification", "Duplicate vote prevention (Composite unique indexes)", "Cryptographic ballot encryption", "High-concurrency vote queueing"]
    },
    {
      id: "result-service",
      name: "Result Service",
      port: 3006,
      tech: "NestJS + WebSockets + Redis",
      responsibilities: ["Real-time vote aggregation & tallying", "Percentage calculations", "WebSocket broadcast of live results", "Cryptographic audit verification"]
    },
    {
      id: "notification-service",
      name: "Notification Service",
      port: 3007,
      tech: "NestJS + SendGrid + Twilio",
      responsibilities: ["Email ballot invitations & confirmations", "SMS verification codes", "Election status broadcast", "System alert notifications"]
    },
    {
      id: "ai-assistant-service",
      name: "AI Assistant Service",
      port: 3008,
      tech: "NestJS + @google/genai",
      responsibilities: ["Election FAQ & rules guidance", "Manifesto summarization for voters", "Multilingual voter assistance", "Automated anomaly & fraud detection alerts"]
    }
  ],
  prismaSchema: `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  ORGANIZATION_ADMIN
  STUDENT
  CANDIDATE
}

enum OrgStatus {
  ACTIVE
  SUSPENDED
  PENDING
}

enum ElectionStatus {
  DRAFT
  PENDING
  ACTIVE
  COMPLETED
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}

enum SubPlan {
  BASIC
  PREMIUM
  ENTERPRISE
}

model Organization {
  id            String         @id @default(uuid())
  name          String         @unique
  logo          String?
  description   String?
  primaryColor  String         @default("#2563eb")
  contactEmail  String
  status        OrgStatus      @default(ACTIVE)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  users         User[]
  clubs         Club[]
  subscriptions Subscription[]

  @@index([status])
}

model User {
  id             String        @id @default(uuid())
  fullName       String
  email          String        @unique
  password       String
  phone          String?
  role           Role          @default(STUDENT)
  organizationId String
  organization   Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  candidates     Candidate[]
  voters         Voter[]
  votes          Vote[]
  auditLogs      AuditLog[]

  @@index([organizationId])
  @@index([email])
}

model Club {
  id             String       @id @default(uuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name           String
  description    String?
  logo           String?
  status         OrgStatus    @default(ACTIVE)
  createdAt      DateTime     @default(now())

  elections      Election[]

  @@index([organizationId])
}

model Election {
  id          String         @id @default(uuid())
  clubId      String
  club        Club           @relation(fields: [clubId], references: [id], onDelete: Cascade)
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime
  status      ElectionStatus @default(DRAFT)
  createdBy   String
  createdAt   DateTime       @default(now())

  positions   Position[]
  voters      Voter[]
  votes       Vote[]
  results     Result[]

  @@index([clubId])
  @@index([status])
  @@index([startDate, endDate])
}

model Position {
  id          String      @id @default(uuid())
  electionId  String
  election    Election    @relation(fields: [electionId], references: [id], onDelete: Cascade)
  name        String
  description String?

  candidates  Candidate[]
  votes       Vote[]

  @@index([electionId])
}

model Candidate {
  id                  String         @id @default(uuid())
  userId              String
  user                User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  positionId          String
  position            Position       @relation(fields: [positionId], references: [id], onDelete: Cascade)
  profileImage        String?
  course              String?
  year                Int?
  department          String?
  manifesto           String?
  campaignInformation String?
  approvalStatus      ApprovalStatus @default(PENDING)
  createdAt           DateTime       @default(now())

  votes               Vote[]
  results             Result[]

  @@index([positionId])
  @@index([userId])
  @@index([approvalStatus])
}

model Voter {
  id         String    @id @default(uuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  electionId String
  election   Election  @relation(fields: [electionId], references: [id], onDelete: Cascade)
  hasVoted   Boolean   @default(false)
  votedAt    DateTime?

  @@unique([userId, electionId])
  @@index([electionId])
}

model Vote {
  id            String    @id @default(uuid())
  electionId    String
  election      Election  @relation(fields: [electionId], references: [id], onDelete: Cascade)
  positionId    String
  position      Position  @relation(fields: [positionId], references: [id], onDelete: Cascade)
  candidateId   String
  candidate     Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  voterId       String
  voter         User      @relation(fields: [voterId], references: [id], onDelete: Cascade)
  encryptedVote String
  createdAt     DateTime  @default(now())

  @@unique([electionId, voterId, positionId])
  @@index([electionId])
  @@index([candidateId])
}

model Result {
  id          String    @id @default(uuid())
  electionId  String
  election    Election  @relation(fields: [electionId], references: [id], onDelete: Cascade)
  candidateId String
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  totalVotes  Int       @default(0)
  percentage  Float     @default(0.0)
  updatedAt   DateTime  @updatedAt

  @@unique([electionId, candidateId])
  @@index([electionId])
}

model AuditLog {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  action      String
  description String
  ipAddress   String?
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}

model Subscription {
  id             String    @id @default(uuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  plan           SubPlan   @default(BASIC)
  startDate      DateTime  @default(now())
  endDate        DateTime
  status         OrgStatus @default(ACTIVE)

  @@index([organizationId])
}
`
};

app.get("/api/architecture", (req, res) => {
  res.json(architectureData);
});

// In-memory mock database state for interactive API testing
let mockOrganizations = [
  { id: "org-1", name: "Mwenge Catholic University", contactEmail: "admin@mwecau.ac.tz", status: "ACTIVE", primaryColor: "#2563eb", createdAt: new Date().toISOString() },
  { id: "org-2", name: "University of Dar es Salaam", contactEmail: "admin@udsm.ac.tz", status: "ACTIVE", primaryColor: "#059669", createdAt: new Date().toISOString() }
];

let mockUsers = [
  { id: "user-1", fullName: "Dr. John Sarwi", email: "john@smartvote.ai", role: "SUPER_ADMIN", organizationId: "org-1" },
  { id: "user-2", fullName: "Alice Mwamba", email: "alice@mwecau.ac.tz", role: "STUDENT", organizationId: "org-1" }
];

let mockClubs = [
  { id: "club-1", organizationId: "org-1", name: "Computing & IT Society", status: "ACTIVE" },
  { id: "club-2", organizationId: "org-1", name: "Business & Economics Club", status: "ACTIVE" }
];

let mockElections = [
  { id: "el-1", clubId: "club-1", title: "SRC Presidential Election 2026", status: "ACTIVE", startDate: "2026-08-01T00:00:00Z", endDate: "2026-08-05T23:59:59Z" }
];

let mockCandidates = [
  { id: "cand-1", userId: "user-2", positionId: "pos-1", manifesto: "Advocating for 24/7 campus Wi-Fi and transparent student budgeting.", approvalStatus: "APPROVED" }
];

// --- REST API ENDPOINTS ---

// Auth
app.post("/api/auth/register", (req, res) => {
  const { fullName, email, phone, password, organizationId } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ statusCode: 400, message: "Missing required registration fields", error: "Bad Request" });
  }
  const newUser = {
    id: "user-" + (mockUsers.length + 1),
    fullName,
    email,
    phone,
    role: "STUDENT",
    organizationId: organizationId || "org-1"
  };
  mockUsers.push(newUser);
  res.status(201).json({
    message: "User registered successfully with bcrypt password hashing (salt=12)",
    user: newUser,
    accessToken: "eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockAccessTokenTokenJwt"
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email) || mockUsers[0];
  res.json({
    message: "Authentication successful",
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockAccessTokenJwtToken",
    refreshToken: "refreshToken_mock_778923",
    user
  });
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ message: "Successfully logged out and session revoked" });
});

app.post("/api/auth/refresh-token", (req, res) => {
  res.json({ accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refreshedAccessTokenJwt" });
});

// Users
app.get("/api/users/profile", (req, res) => {
  res.json(mockUsers[0]);
});

app.patch("/api/users/profile", (req, res) => {
  res.json({ message: "User profile updated successfully", updated: req.body });
});

// Organizations
app.get("/api/organizations", (req, res) => {
  res.json(mockOrganizations);
});

app.post("/api/organizations", (req, res) => {
  const { name, contactEmail, description } = req.body;
  const newOrg = { id: "org-" + (mockOrganizations.length + 1), name, contactEmail, description, status: "ACTIVE", primaryColor: "#141414", createdAt: new Date().toISOString() };
  mockOrganizations.push(newOrg);
  res.status(201).json(newOrg);
});

app.patch("/api/organizations/:id", (req, res) => {
  res.json({ message: "Organization updated", id: req.params.id, updates: req.body });
});

// Clubs
app.get("/api/clubs", (req, res) => {
  res.json(mockClubs);
});

app.post("/api/clubs", (req, res) => {
  const newClub = { id: "club-" + (mockClubs.length + 1), ...req.body, status: "ACTIVE" };
  mockClubs.push(newClub);
  res.status(201).json(newClub);
});

app.patch("/api/clubs/:id", (req, res) => {
  res.json({ message: "Club updated", id: req.params.id, updates: req.body });
});

// Elections
app.get("/api/elections", (req, res) => {
  res.json(mockElections);
});

app.get("/api/elections/:id", (req, res) => {
  const el = mockElections.find(e => e.id === req.params.id) || mockElections[0];
  res.json(el);
});

app.post("/api/elections", (req, res) => {
  const newElection = { id: "el-" + (mockElections.length + 1), ...req.body, status: "DRAFT" };
  mockElections.push(newElection);
  res.status(201).json(newElection);
});

app.patch("/api/elections/:id", (req, res) => {
  res.json({ message: "Election updated", id: req.params.id, updates: req.body });
});

// Candidates
app.get("/api/candidates", (req, res) => {
  res.json(mockCandidates);
});

app.post("/api/candidates/apply", (req, res) => {
  const newCand = { id: "cand-" + (mockCandidates.length + 1), ...req.body, approvalStatus: "PENDING" };
  mockCandidates.push(newCand);
  res.status(201).json({ message: "Candidate application submitted for review", candidate: newCand });
});

app.patch("/api/candidates/:id/approve", (req, res) => {
  res.json({ message: "Candidate approved successfully", candidateId: req.params.id, approvalStatus: "APPROVED" });
});

// --- MODULE 5: SECURE VOTING ENGINE ---
let mockVotes: any[] = [
  { id: "v-1", electionId: "el-1", positionId: "pos-1", candidateId: "cand-1", voterId: "user-2", encryptedVote: "aes256:iv:cipher_payload_abc99812", createdAt: new Date().toISOString() }
];

let mockAuditLogs: any[] = [
  { id: "log-1", userId: "user-2", action: "CAST_VOTE", description: "Successfully cast encrypted ballot in election el-1", ipAddress: "192.168.1.50", createdAt: new Date().toISOString() }
];

app.post("/api/voting/cast-vote", (req, res) => {
  const { electionId, votes } = req.body;
  if (!electionId || !votes || !Array.isArray(votes)) {
    return res.status(400).json({ statusCode: 400, message: "Invalid voting payload. electionId and votes array required." });
  }

  // Check duplicate vote constraint simulation
  const voterId = "user-2"; // simulated authenticated user
  const existingVote = mockVotes.find(v => v.electionId === electionId && v.voterId === voterId);
  if (existingVote) {
    return res.status(409).json({ statusCode: 409, message: "Duplicate vote rejected: Voter has already cast a ballot in this election." });
  }

  // Record votes with AES-256 simulation and audit logs
  for (const vote of votes) {
    mockVotes.push({
      id: "v-" + (mockVotes.length + 1),
      electionId,
      positionId: vote.positionId,
      candidateId: vote.candidateId,
      voterId,
      encryptedVote: "aes256:iv:encrypted_" + Buffer.from(vote.candidateId).toString('base64'),
      createdAt: new Date().toISOString()
    });
  }

  mockAuditLogs.push({
    id: "log-" + (mockAuditLogs.length + 1),
    userId: voterId,
    action: "CAST_VOTE",
    description: `Casted ${votes.length} ballots for election ${electionId}`,
    ipAddress: "192.168.1.105",
    createdAt: new Date().toISOString()
  });

  const confirmationCode = "SV-" + Math.floor(100000 + Math.random() * 900000);
  res.status(201).json({
    success: true,
    message: "Vote submitted successfully with AES-256 encryption and transaction rollback safety",
    confirmationCode
  });
});

app.get("/api/voting/status", (req, res) => {
  res.json({
    hasVoted: true,
    votedAt: new Date().toISOString(),
    election: "MWECAU Computer Science Club Election 2026",
    confirmationCode: "SV-827391"
  });
});

// --- MODULE 6: REAL-TIME LIVE RESULTS SYSTEM ---
app.get("/api/results/live/:electionId", (req, res) => {
  const { electionId } = req.params;
  const totalVotes = 876;
  const totalRegistered = 1250;
  const participation = ((totalVotes / totalRegistered) * 100).toFixed(2);

  res.json({
    election: "MWECAU Computer Science Club Election 2026",
    electionId,
    totalRegisteredVoters: totalRegistered,
    totalVotesCast: totalVotes,
    participationPercentage: parseFloat(participation),
    remainingVoters: totalRegistered - totalVotes,
    candidates: [
      {
        name: "John Charles Sarwi",
        position: "President",
        votes: 560,
        percentage: 63.9,
        ranking: 1
      },
      {
        name: "Peter Joseph",
        position: "President",
        votes: 316,
        percentage: 36.1,
        ranking: 2
      }
    ],
    securityStatus: {
      anomalyDetected: false,
      activeSecurityAlerts: 0,
      concurrencyRate: "14,200 req/sec (Redis cached)"
    }
  });
});

// --- MODULE 8: AI ELECTION ASSISTANT & RAG CHAT ---
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, userRole, organizationName } = req.body;
    const client = getAIClient();

    const systemPrompt = `You are SmartVote AI Assistant, an expert RAG-powered election assistant for ${organizationName || 'SmartVote Enterprise'}. 
User Role: ${userRole || 'STUDENT'}.
Knowledge base includes election rules, candidate manifestos (e.g. John Charles Sarwi for President, Peter Joseph), voting procedures, schedule, and participation stats (876 votes cast, 70.08% turnout).
Provide accurate, helpful, strictly neutral information. Do not attempt to manipulate voter decisions.`;

    if (!client) {
      // Intelligent fallback simulator based on prompt keywords
      let reply = "Hello! I am your SmartVote AI Assistant. How can I help you with today's election?";
      const lower = (prompt || "").toLowerCase();
      if (lower.includes("vote") || lower.includes("how")) {
        reply = "To vote: Log into your account, navigate to the Voter Portal, review available candidates for each position (such as President), select your preferred candidate, and confirm your vote. Your ballot is secured with AES-256 encryption and a unique confirmation receipt.";
      } else if (lower.includes("john") || lower.includes("sarwi")) {
        reply = "John Charles Sarwi is running for Club President (BSc Computer Science, 1st Year). His manifesto focuses on improving campus coding culture, 24/7 Wi-Fi access, and organizing annual student hackathons.";
      } else if (lower.includes("peter") || lower.includes("joseph")) {
        reply = "Peter Joseph is running for Club President (BSc Information Technology). His manifesto focuses on modern computer labs, student welfare grants, and career mentorship programs.";
      } else if (lower.includes("stats") || lower.includes("turnout") || lower.includes("voted")) {
        reply = "Current Election Statistics: 876 students have voted out of 1,250 registered voters, representing a 70.08% participation rate. Voting is active and secured via Redis caching and PostgreSQL.";
      } else if (lower.includes("admin") || lower.includes("create")) {
        reply = "As an Administrator, you can create elections, manage club positions, approve candidate nominations, monitor live socket tallying, and review security anomaly alerts.";
      }
      return res.json({ response: reply });
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nUser Question: ${prompt}`
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// --- MODULE 9: COMMERCIAL SaaS, SUBSCRIPTIONS & WHITE-LABEL ---
let currentSubscription = {
  plan: "PREMIUM",
  price: "$199/month",
  status: "ACTIVE",
  renewalDate: "2027-08-02",
  features: ["Unlimited Elections", "AI Assistant (RAG)", "Advanced Analytics", "Custom White-Label Branding"]
};

let whiteLabelConfig = {
  systemName: "MWECAU Student Election Portal",
  logoText: "MWECAU VOTE",
  primaryColor: "#141414",
  domain: "elections.mwecau.ac.tz",
  supportEmail: "election-support@mwecau.ac.tz"
};

let fraudLogs = [
  { id: "fl-1", severity: "LOW", description: "Multiple rapid tab switches detected for user-4", timestamp: new Date(Date.now() - 3600000).toISOString(), ip: "192.168.1.88" },
  { id: "fl-2", severity: "NORMAL", description: "IP geolocation verified for 850 concurrent voters in subnet 192.168.1.0/24", timestamp: new Date(Date.now() - 7200000).toISOString(), ip: "192.168.1.1" }
];

app.get("/api/saas/subscription", (req, res) => {
  res.json(currentSubscription);
});

app.post("/api/saas/subscription", (req, res) => {
  const { plan, paymentMethod } = req.body;
  if (!plan) {
    return res.status(400).json({ message: "Plan is required" });
  }
  let price = "$49/month";
  if (plan === "PREMIUM") price = "$199/month";
  if (plan === "ENTERPRISE") price = "$499/month";

  currentSubscription = {
    plan,
    price,
    status: "ACTIVE",
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    features: plan === "BASIC" ? ["1 Organization", "3 Elections", "Basic Analytics"] : plan === "PREMIUM" ? ["Unlimited Elections", "AI Assistant", "Advanced Analytics", "Custom Branding"] : ["Unlimited Users", "Dedicated Support", "Custom Deployment", "SLA 99.99%"]
  };

  res.json({
    success: true,
    message: `Successfully upgraded subscription to ${plan} via ${paymentMethod || 'Stripe/Mobile Money'}`,
    subscription: currentSubscription
  });
});

app.get("/api/saas/whitelabel", (req, res) => {
  res.json(whiteLabelConfig);
});

app.post("/api/saas/whitelabel", (req, res) => {
  const { systemName, logoText, primaryColor, domain, supportEmail } = req.body;
  whiteLabelConfig = {
    systemName: systemName || whiteLabelConfig.systemName,
    logoText: logoText || whiteLabelConfig.logoText,
    primaryColor: primaryColor || whiteLabelConfig.primaryColor,
    domain: domain || whiteLabelConfig.domain,
    supportEmail: supportEmail || whiteLabelConfig.supportEmail
  };
  res.json({ success: true, message: "White-label configuration updated successfully across tenant domains", whiteLabelConfig });
});

app.get("/api/analytics/fraud", (req, res) => {
  res.json({
    fraudLogs,
    systemIntegrity: "100%",
    activeShields: ["Rate Limiter (Redis)", "IP Anomaly Detector", "Duplicate Vote Prevention Engine"]
  });
});

// --- VOTER REGISTRATION & VERIFICATION MODULE ---
let mockVoters = [
  {
    id: "voter-1",
    fullName: "John Charles Sarwi",
    registrationNumber: "CS/2024/001",
    email: "johncharlessarwi@gmail.com",
    phone: "+255 712 345 678",
    organization: "MWECAU Student Union",
    club: "Computing & IT Club",
    department: "Computer Science",
    course: "BSc Computer Science",
    yearOfStudy: "Year 3",
    gender: "Male",
    dateOfBirth: "2002-05-14",
    approvalStatus: "Approved",
    votingStatus: "Has Voted",
    role: "VOTER",
    registrationDate: "2026-07-10 14:20",
    lastLogin: "2026-08-03 09:15",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  },
  {
    id: "voter-2",
    fullName: "Grace Mallya",
    registrationNumber: "BA/2024/042",
    email: "grace.mallya@mwecau.ac.tz",
    phone: "+255 754 987 654",
    organization: "MWECAU Student Union",
    club: "Debating Society",
    department: "Business Administration",
    course: "Bachelor of Business Admin",
    yearOfStudy: "Year 2",
    gender: "Female",
    dateOfBirth: "2003-11-20",
    approvalStatus: "Approved",
    votingStatus: "Not Voted",
    role: "VOTER",
    registrationDate: "2026-07-12 10:05",
    lastLogin: "2026-08-02 16:30",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
  },
  {
    id: "voter-3",
    fullName: "Baraka Juma",
    registrationNumber: "ENG/2024/089",
    email: "baraka.juma@mwecau.ac.tz",
    phone: "+255 688 111 222",
    organization: "MWECAU Student Union",
    club: "Engineering Guild",
    department: "Civil Engineering",
    course: "BSc Civil Engineering",
    yearOfStudy: "Year 1",
    gender: "Male",
    dateOfBirth: "2004-02-10",
    approvalStatus: "Pending Verification",
    votingStatus: "Not Voted",
    role: "VOTER",
    registrationDate: "2026-08-02 22:11",
    lastLogin: "Never",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  }
];

let notificationLogs: Array<{ id: string; recipient: string; type: string; message: string; timestamp: string }> = [
  { id: "notif-1", recipient: "johncharlessarwi@gmail.com", type: "EMAIL_VOTING_CONFIRMATION", message: "Your vote for Club President has been securely recorded with receipt receipt #REC-98214.", timestamp: "2026-08-02 10:30" },
  { id: "notif-2", recipient: "grace.mallya@mwecau.ac.tz", type: "EMAIL_REGISTRATION_APPROVED", message: "Your voter account has been verified and approved by the administrator.", timestamp: "2026-08-01 09:00" }
];

app.get("/api/admin/voters", (req, res) => {
  const { search, organization, club, approvalStatus } = req.query;
  let results = [...mockVoters];

  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(v => v.fullName.toLowerCase().includes(q) || v.registrationNumber.toLowerCase().includes(q) || v.email.toLowerCase().includes(q));
  }
  if (organization && organization !== "All") {
    results = results.filter(v => v.organization === organization);
  }
  if (club && club !== "All") {
    results = results.filter(v => v.club === club);
  }
  if (approvalStatus && approvalStatus !== "All") {
    results = results.filter(v => v.approvalStatus === approvalStatus);
  }

  res.json({
    voters: results,
    totalCount: mockVoters.length,
    filteredCount: results.length,
    approvalPendingCount: mockVoters.filter(v => v.approvalStatus === "Pending Verification").length
  });
});

app.post("/api/voters/register", (req, res) => {
  const { fullName, registrationNumber, email, phone, organization, club, department, course, yearOfStudy, gender, dateOfBirth, password } = req.body;
  
  if (!fullName || !registrationNumber || !email || !password) {
    return res.status(400).json({ success: false, message: "Full Name, Registration Number, Email, and Password are required." });
  }

  // Check unique registration number or email
  const existing = mockVoters.find(v => v.registrationNumber === registrationNumber || v.email === email);
  if (existing) {
    return res.status(400).json({ success: false, message: "A voter with this Registration Number or Email is already registered in the system." });
  }

  const newVoter = {
    id: "voter-" + (mockVoters.length + 1),
    fullName,
    registrationNumber,
    email,
    phone: phone || "+255 700 000 000",
    organization: organization || "MWECAU Student Union",
    club: club || "General Student Body",
    department: department || "General Studies",
    course: course || "Degree Program",
    yearOfStudy: yearOfStudy || "Year 1",
    gender: gender || "Not Specified",
    dateOfBirth: dateOfBirth || "2000-01-01",
    approvalStatus: "Pending Verification",
    votingStatus: "Not Voted",
    role: "VOTER",
    registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    lastLogin: "Never",
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
  };

  mockVoters.push(newVoter);

  // Send notification log
  notificationLogs.unshift({
    id: "notif-" + (notificationLogs.length + 1),
    recipient: email,
    type: "EMAIL_REGISTRATION_SUBMITTED",
    message: `Dear ${fullName}, your voter registration for ${organization || 'SmartVote'} has been successfully submitted and is awaiting administrator verification.`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  res.status(201).json({
    success: true,
    message: "Registration submitted successfully! Your account is pending administrator approval.",
    voter: newVoter
  });
});

app.post("/api/voters/login", (req, res) => {
  const { registrationNumber, password } = req.body;
  const voter = mockVoters.find(v => v.registrationNumber === registrationNumber || v.email === registrationNumber);
  
  if (!voter) {
    return res.status(401).json({ success: false, message: "Invalid registration number or password." });
  }

  if (voter.approvalStatus !== "Approved") {
    return res.status(403).json({ success: false, message: "Your voter account is currently pending administrator verification or has been suspended." });
  }

  voter.lastLogin = new Date().toISOString().replace('T', ' ').substring(0, 16);

  res.json({
    success: true,
    message: `Welcome back, ${voter.fullName}!`,
    voter,
    token: "jwt_token_secure_" + voter.id
  });
});

app.get("/api/voters/profile", (req, res) => {
  // Default to first voter or query
  const voter = mockVoters[0];
  res.json(voter);
});

app.patch("/api/voters/profile", (req, res) => {
  const { phone, club, course, yearOfStudy } = req.body;
  const voter = mockVoters[0];
  if (phone) voter.phone = phone;
  if (club) voter.club = club;
  if (course) voter.course = course;
  if (yearOfStudy) voter.yearOfStudy = yearOfStudy;

  res.json({ success: true, message: "Profile successfully updated", voter });
});

app.post("/api/admin/voters/approve", (req, res) => {
  const { voterId } = req.body;
  const voter = mockVoters.find(v => v.id === voterId);
  if (!voter) {
    return res.status(404).json({ success: false, message: "Voter not found" });
  }
  voter.approvalStatus = "Approved";

  notificationLogs.unshift({
    id: "notif-" + (notificationLogs.length + 1),
    recipient: voter.email,
    type: "EMAIL_REGISTRATION_APPROVED",
    message: `Congratulations ${voter.fullName}! Your voter registration has been approved. You can now participate in active elections.`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  res.json({ success: true, message: `Voter ${voter.fullName} approved successfully`, voter });
});

app.post("/api/admin/voters/reject", (req, res) => {
  const { voterId, reason } = req.body;
  const voter = mockVoters.find(v => v.id === voterId);
  if (!voter) {
    return res.status(404).json({ success: false, message: "Voter not found" });
  }
  voter.approvalStatus = "Rejected";

  notificationLogs.unshift({
    id: "notif-" + (notificationLogs.length + 1),
    recipient: voter.email,
    type: "EMAIL_REGISTRATION_REJECTED",
    message: `Dear ${voter.fullName}, your voter registration was not approved. Reason: ${reason || 'Invalid verification credentials.'}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  res.json({ success: true, message: `Voter ${voter.fullName} rejected`, voter });
});

app.get("/api/notifications/logs", (req, res) => {
  res.json(notificationLogs);
});


app.post("/api/ai-architect", async (req, res) => {
  try {
    const { prompt } = req.body;
    const client = getAIClient();
    
    if (!client) {
      return res.json({
        response: "AI Architect Service is in simulation mode (GEMINI_API_KEY is not configured). Based on enterprise architecture principles, your query about '" + prompt + "' is successfully addressed by isolating tenants at the organizationId level, enforcing strict JWT + RBAC authorization, and utilizing Redis queuing for peak election concurrency."
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a Principal Enterprise Systems Architect and PostgreSQL Database Expert for SmartVote AI, a high-concurrency multi-tenant election SaaS platform. Answer the following architectural question thoroughly, professionally, and concisely with specific technical recommendations: ${prompt}`
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("AI Architect error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
