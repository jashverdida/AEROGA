// Mock API client — no backend required (portfolio/demo mode)
import {
  apiKeys,
  requestLogs,
  analyticsSummary,
  requestsOverTime,
  topEndpoints,
  benefits,
  employees,
} from './mockData.js';

let mockApiKeys = [...apiKeys];
let mockBenefits = [...benefits];
let mockEmployees = [...employees];

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

const ok = (data) => ({ data: { success: true, data } });
const paged = (items, page = 0, size = 10) => {
  const start = page * size;
  const content = items.slice(start, start + size);
  return ok({
    content,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    number: page,
    size,
  });
};

async function mockRequest(method, url, body) {
  await delay();
  const u = url.split('?')[0];
  const params = Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''));

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (method === 'POST' && u === '/api/auth/login') {
    return ok({ token: 'mock.jwt.token', message: 'Login successful' });
  }
  if (method === 'POST' && u === '/api/auth/register') {
    return ok({ token: 'mock.jwt.token', message: 'Registration successful' });
  }

  // ── Analytics ─────────────────────────────────────────────────────────────
  if (method === 'GET' && u === '/api/admin/analytics/summary') {
    return ok(analyticsSummary);
  }
  if (method === 'GET' && u === '/api/admin/analytics/requests-over-time') {
    return ok(requestsOverTime);
  }
  if (method === 'GET' && u === '/api/admin/analytics/top-endpoints') {
    return ok(topEndpoints);
  }

  // ── Logs ──────────────────────────────────────────────────────────────────
  if (method === 'GET' && u === '/api/admin/logs') {
    const page = parseInt(params.page || '0');
    const size = parseInt(params.size || '10');
    return paged(requestLogs, page, size);
  }

  // ── API Keys ──────────────────────────────────────────────────────────────
  if (method === 'GET' && u === '/api/api-keys') return ok(mockApiKeys);

  if (method === 'POST' && u === '/api/api-keys') {
    const newKey = {
      id: `ak_${generateId()}`,
      name: body.name,
      key: `aero_new_${generateId()}${generateId()}`,
      status: 'ACTIVE',
      rateLimit: body.rateLimit || 1000,
      requestCount: 0,
      lastUsed: null,
      createdAt: new Date().toISOString(),
    };
    mockApiKeys = [newKey, ...mockApiKeys];
    return ok(newKey);
  }

  if (/^\/api\/api-keys\/[^/]+\/revoke$/.test(u)) {
    const id = u.split('/')[3];
    mockApiKeys = mockApiKeys.map((k) => (k.id === id ? { ...k, status: 'REVOKED' } : k));
    return ok(mockApiKeys.find((k) => k.id === id));
  }

  const akMatch = u.match(/^\/api\/api-keys\/([^/]+)$/);
  if (akMatch) {
    const id = akMatch[1];
    if (method === 'PUT') {
      mockApiKeys = mockApiKeys.map((k) => (k.id === id ? { ...k, ...body } : k));
      return ok(mockApiKeys.find((k) => k.id === id));
    }
    if (method === 'DELETE') {
      mockApiKeys = mockApiKeys.filter((k) => k.id !== id);
      return ok({ message: 'API key deleted' });
    }
  }

  // ── Benefits ──────────────────────────────────────────────────────────────
  if (method === 'GET' && u === '/api/benefits') return ok(mockBenefits);

  if (method === 'POST' && u === '/api/benefits') {
    const b = {
      id: `ben_${generateId()}`,
      ...body,
      enrolledCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockBenefits = [b, ...mockBenefits];
    return ok(b);
  }

  if (/^\/api\/benefits\/[^/]+\/enroll$/.test(u)) {
    const id = u.split('/')[3];
    mockBenefits = mockBenefits.map((b) =>
      b.id === id ? { ...b, enrolledCount: b.enrolledCount + 1 } : b
    );
    if (body?.employeeId) {
      mockEmployees = mockEmployees.map((e) =>
        e.id === body.employeeId
          ? { ...e, enrolledBenefitIds: [...new Set([...(e.enrolledBenefitIds || []), id])] }
          : e
      );
    }
    return ok({ message: 'Enrolled successfully' });
  }

  if (/^\/api\/benefits\/[^/]+\/unenroll\/[^/]+$/.test(u)) {
    const parts = u.split('/');
    const benId = parts[3];
    const empId = parts[5];
    mockBenefits = mockBenefits.map((b) =>
      b.id === benId ? { ...b, enrolledCount: Math.max(0, b.enrolledCount - 1) } : b
    );
    mockEmployees = mockEmployees.map((e) =>
      e.id === empId
        ? { ...e, enrolledBenefitIds: (e.enrolledBenefitIds || []).filter((bid) => bid !== benId) }
        : e
    );
    return ok({ message: 'Unenrolled successfully' });
  }

  const benMatch = u.match(/^\/api\/benefits\/([^/]+)$/);
  if (benMatch) {
    const id = benMatch[1];
    if (method === 'GET') return ok(mockBenefits.find((b) => b.id === id));
    if (method === 'PUT') {
      mockBenefits = mockBenefits.map((b) => (b.id === id ? { ...b, ...body } : b));
      return ok(mockBenefits.find((b) => b.id === id));
    }
    if (method === 'DELETE') {
      mockBenefits = mockBenefits.filter((b) => b.id !== id);
      return ok({ message: 'Benefit deleted' });
    }
  }

  // ── Employees ─────────────────────────────────────────────────────────────
  // Returns flat array (Employees.jsx does not paginate)
  if (method === 'GET' && u === '/api/employees') return ok(mockEmployees);

  if (method === 'POST' && u === '/api/employees') {
    const emp = {
      id: `emp_${generateId()}`,
      ...body,
      enrolledBenefitIds: [],
      active: true,
      createdAt: new Date().toISOString(),
    };
    mockEmployees = [emp, ...mockEmployees];
    return ok(emp);
  }

  // GET /api/employees/{id}/benefits — returns benefit objects for enrolled IDs
  if (/^\/api\/employees\/[^/]+\/benefits$/.test(u) && method === 'GET') {
    const empId = u.split('/')[3];
    const emp = mockEmployees.find((e) => e.id === empId);
    const enrolled = mockBenefits.filter((b) => (emp?.enrolledBenefitIds || []).includes(b.id));
    return ok(enrolled);
  }

  // POST /api/employees/{id}/enroll — enroll employee in a benefit
  if (/^\/api\/employees\/[^/]+\/enroll$/.test(u) && method === 'POST') {
    const empId = u.split('/')[3];
    const { benefitId } = body || {};
    mockEmployees = mockEmployees.map((e) =>
      e.id === empId
        ? { ...e, enrolledBenefitIds: [...new Set([...(e.enrolledBenefitIds || []), benefitId])] }
        : e
    );
    mockBenefits = mockBenefits.map((b) =>
      b.id === benefitId ? { ...b, enrolledCount: b.enrolledCount + 1 } : b
    );
    return ok({ message: 'Enrolled successfully' });
  }

  // DELETE /api/employees/{id}/benefits/{benefitId} — unenroll
  if (/^\/api\/employees\/[^/]+\/benefits\/[^/]+$/.test(u) && method === 'DELETE') {
    const parts = u.split('/');
    const empId = parts[3];
    const benId = parts[5];
    mockEmployees = mockEmployees.map((e) =>
      e.id === empId
        ? { ...e, enrolledBenefitIds: (e.enrolledBenefitIds || []).filter((bid) => bid !== benId) }
        : e
    );
    mockBenefits = mockBenefits.map((b) =>
      b.id === benId ? { ...b, enrolledCount: Math.max(0, b.enrolledCount - 1) } : b
    );
    return ok({ message: 'Unenrolled successfully' });
  }

  const empMatch = u.match(/^\/api\/employees\/([^/]+)$/);
  if (empMatch) {
    const id = empMatch[1];
    if (method === 'GET') return ok(mockEmployees.find((e) => e.id === id));
    if (method === 'PUT') {
      mockEmployees = mockEmployees.map((e) => (e.id === id ? { ...e, ...body } : e));
      return ok(mockEmployees.find((e) => e.id === id));
    }
    if (method === 'DELETE') {
      mockEmployees = mockEmployees.filter((e) => e.id !== id);
      return ok({ message: 'Employee deleted' });
    }
  }

  throw new Error(`Unhandled mock route: ${method} ${url}`);
}

// Public API — same interface as real axios instance
const API = {
  get: (url) => mockRequest('GET', url),
  post: (url, body) => mockRequest('POST', url, body),
  put: (url, body) => mockRequest('PUT', url, body),
  delete: (url) => mockRequest('DELETE', url),
  interceptors: { request: { use: () => {} }, response: { use: () => {} } },
};

export default API;
