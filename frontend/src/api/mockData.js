// In-memory mock state for demo/portfolio mode

const now = new Date();

const generateId = () => Math.random().toString(36).substr(2, 9);

const pad = (n) => String(n).padStart(2, '0');

const daysAgo = (n) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const hoursAgo = (n) => {
  const d = new Date(now);
  d.setHours(d.getHours() - n);
  return d.toISOString();
};

// ── API Keys ────────────────────────────────────────────────────────────────
export const apiKeys = [
  {
    id: 'ak_001',
    name: 'Production Integration',
    key: 'aero_prod_7f2e9a4b1c3d8e6f2a5b9c4d7e1f3a8b',
    status: 'ACTIVE',
    rateLimit: 1000,
    requestCount: 84723,
    lastUsed: hoursAgo(1),
    createdAt: daysAgo(90),
  },
  {
    id: 'ak_002',
    name: 'Staging Environment',
    key: 'aero_stg_3c9d2e5f8a1b4c7d0e3f6a9b2c5d8e1f',
    status: 'ACTIVE',
    rateLimit: 500,
    requestCount: 12045,
    lastUsed: hoursAgo(6),
    createdAt: daysAgo(60),
  },
  {
    id: 'ak_003',
    name: 'QA Testing',
    key: 'aero_qa_1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d',
    status: 'ACTIVE',
    rateLimit: 200,
    requestCount: 3218,
    lastUsed: hoursAgo(24),
    createdAt: daysAgo(30),
  },
  {
    id: 'ak_004',
    name: 'Legacy Connector',
    key: 'aero_lgc_8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e',
    status: 'REVOKED',
    rateLimit: 100,
    requestCount: 501,
    lastUsed: daysAgo(45),
    createdAt: daysAgo(120),
  },
  {
    id: 'ak_005',
    name: 'Mobile App Backend',
    key: 'aero_mob_5d8e1f4a7b0c3d6e9f2a5b8c1d4e7f0a',
    status: 'ACTIVE',
    rateLimit: 2000,
    requestCount: 231894,
    lastUsed: hoursAgo(0),
    createdAt: daysAgo(180),
  },
];

// ── Request Logs ─────────────────────────────────────────────────────────────
const endpoints = [
  'GET /api/benefits',
  'POST /api/benefits/enroll',
  'GET /api/employees',
  'GET /api/auth/me',
  'PUT /api/employees/{id}',
  'DELETE /api/benefits/{id}',
  'GET /api/admin/analytics/summary',
  'POST /api/api-keys',
  'GET /api/admin/logs',
];
const statuses = [200, 200, 200, 200, 200, 201, 400, 401, 429, 500];
const consumers = ['ak_001', 'ak_002', 'ak_003', 'ak_005'];

export const requestLogs = Array.from({ length: 120 }, (_, i) => ({
  id: `log_${generateId()}`,
  apiKey: consumers[i % consumers.length],
  endpoint: endpoints[i % endpoints.length],
  method: endpoints[i % endpoints.length].split(' ')[0],
  path: endpoints[i % endpoints.length].split(' ')[1],
  statusCode: statuses[i % statuses.length],
  responseTime: Math.floor(Math.random() * 350) + 20,
  ipAddress: `10.${(i % 4) + 1}.${Math.floor(i / 4) % 255}.${(i * 7) % 255}`,
  timestamp: new Date(now - i * 4 * 60000).toISOString(),
}));

// ── Analytics ────────────────────────────────────────────────────────────────
export const analyticsSummary = {
  totalRequests: 332880,
  activeApiKeys: 4,
  averageResponseTime: 87,
  errorRate: 2.4,
  totalRequestsChange: 12.5,
  activeApiKeysChange: 0,
  averageResponseTimeChange: -5.1,
  errorRateChange: -0.3,
};

export const requestsOverTime = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(now);
  d.setDate(d.getDate() - (6 - i));
  const base = 40000 + Math.floor(Math.random() * 15000);
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    requests: base,
    errors: Math.floor(base * 0.024),
  };
});

export const topEndpoints = [
  { endpoint: 'GET /api/benefits', requests: 98421, avgResponseTime: 62 },
  { endpoint: 'POST /api/benefits/enroll', requests: 67834, avgResponseTime: 124 },
  { endpoint: 'GET /api/employees', requests: 54210, avgResponseTime: 78 },
  { endpoint: 'GET /api/auth/me', requests: 48993, avgResponseTime: 34 },
  { endpoint: 'PUT /api/employees/{id}', requests: 31005, avgResponseTime: 95 },
];

// ── Benefits ──────────────────────────────────────────────────────────────────
export let benefits = [
  {
    id: 'ben_001',
    name: 'Private Health Insurance',
    description: 'Comprehensive health cover including dental and vision for employee and family.',
    category: 'HEALTH',
    provider: 'Bupa',
    value: 3600,
    eligibility: 'ALL_EMPLOYEES',
    enrolledCount: 284,
    active: true,
    createdAt: daysAgo(180),
  },
  {
    id: 'ben_002',
    name: 'Cycle to Work Scheme',
    description: 'Save up to 42% on a new bike and safety equipment through salary sacrifice.',
    category: 'TRANSPORT',
    provider: 'Halfords',
    value: 1000,
    eligibility: 'FULL_TIME',
    enrolledCount: 97,
    active: true,
    createdAt: daysAgo(150),
  },
  {
    id: 'ben_003',
    name: 'Enhanced Pension',
    description: 'Employer matches up to 8% of salary into workplace pension.',
    category: 'FINANCIAL',
    provider: 'Aviva',
    value: 4800,
    eligibility: 'ALL_EMPLOYEES',
    enrolledCount: 312,
    active: true,
    createdAt: daysAgo(360),
  },
  {
    id: 'ben_004',
    name: 'Remote Work Stipend',
    description: '£50/month allowance for home office equipment and internet costs.',
    category: 'LIFESTYLE',
    provider: 'Internal',
    value: 600,
    eligibility: 'ALL_EMPLOYEES',
    enrolledCount: 278,
    active: true,
    createdAt: daysAgo(120),
  },
  {
    id: 'ben_005',
    name: 'Mental Health Support',
    description: 'Access to 24/7 counselling, therapy sessions, and wellbeing app.',
    category: 'HEALTH',
    provider: 'Unmind',
    value: 240,
    eligibility: 'ALL_EMPLOYEES',
    enrolledCount: 198,
    active: true,
    createdAt: daysAgo(90),
  },
  {
    id: 'ben_006',
    name: 'Learning & Development',
    description: '£1,500 annual budget for courses, conferences, and certifications.',
    category: 'EDUCATION',
    provider: 'Internal',
    value: 1500,
    eligibility: 'FULL_TIME',
    enrolledCount: 145,
    active: true,
    createdAt: daysAgo(200),
  },
  {
    id: 'ben_007',
    name: 'Gym Membership',
    description: 'Subsidised gym membership at 3,000+ PureGym locations nationwide.',
    category: 'LIFESTYLE',
    provider: 'PureGym',
    value: 480,
    eligibility: 'ALL_EMPLOYEES',
    enrolledCount: 203,
    active: false,
    createdAt: daysAgo(270),
  },
];

// ── Employees ─────────────────────────────────────────────────────────────────
const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Finance', 'HR', 'Design'];
const titles = [
  'Senior Engineer', 'Product Manager', 'Marketing Lead', 'Account Executive',
  'Financial Analyst', 'HR Business Partner', 'UX Designer', 'Backend Developer',
  'Frontend Developer', 'Data Scientist', 'DevOps Engineer', 'QA Engineer',
];
const firstNames = ['James', 'Sophia', 'Liam', 'Emma', 'Oliver', 'Ava', 'Noah', 'Isabella',
  'William', 'Mia', 'Ethan', 'Charlotte', 'Mason', 'Amelia', 'Lucas', 'Harper'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];

export let employees = Array.from({ length: 40 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  return {
    id: `emp_${pad(i + 1)}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@verpto.io`,
    department: departments[i % departments.length],
    title: titles[i % titles.length],
    employmentType: i % 5 === 0 ? 'PART_TIME' : 'FULL_TIME',
    startDate: daysAgo(30 + i * 15),
    status: i % 12 === 0 ? 'INACTIVE' : 'ACTIVE',
    enrolledBenefits: benefits
      .filter((_, bi) => (i + bi) % 3 === 0)
      .map((b) => b.id),
  };
});
