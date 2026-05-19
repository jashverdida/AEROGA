# AEROGA — Adaptive Employee Rewards & Organization Gateway API

> Built by **VERPTO** · Jashmine Verdida & Eijay Pepito

![Java 17](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?style=flat-square&logo=springboot)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)

---

## What is AEROGA?

AEROGA is a full-stack enterprise API gateway and management platform built for the employee benefits and rewards industry. It acts as the intelligent, policy-enforcing middleware that sits between client applications and a benefits microservice ecosystem.

The gateway authenticates every request via JWT or API keys, enforces configurable per-client rate limits using a sliding-window algorithm, and logs all traffic to MongoDB for real-time analytics. Engineers and administrators interact with the system through a clean React dashboard or directly via the Swagger UI.

The name is inspired by aviation: just as air traffic control systems route and protect everything in the sky, AEROGA routes, protects, and observes every API call across your benefits infrastructure — silently and reliably, so your product teams can focus on building exceptional employee experiences.

---

## Architecture

```
┌─────────────────────┐        ┌────────────────────────────────────────┐        ┌──────────────────┐
│   React Dashboard   │  HTTP  │         AEROGA Gateway                 │  R/W   │   MongoDB Atlas  │
│   Vercel · CDN      │ ──────▶│   Spring Boot 3 · Railway · Docker     │ ──────▶│   Free Tier      │
└─────────────────────┘        │                                        │        └──────────────────┘
                                │  ┌──────────────┐  ┌──────────────┐  │
                                │  │  Auth Filter │  │ Rate Limiter │  │
                                │  └──────────────┘  └──────────────┘  │
                                │  ┌──────────────┐  ┌──────────────┐  │
                                │  │ Req. Logger  │  │ Route Handler│  │
                                │  └──────────────┘  └──────────────┘  │
                                └────────────────────────────────────────┘
```

---

## Features

- **JWT + API Key Authentication** — Login to receive a JWT. Issue named API keys per client. Every request validated at the gateway before reaching any service endpoint.
- **Per-Client Rate Limiting** — Sliding-window rate limiter stored in MongoDB. Configurable max requests per 60-second window. Returns HTTP 429 with `Retry-After` header when exceeded.
- **Request Logging** — Every API call logged with method, path, status code, latency, IP address, and API key ID. Queryable via admin endpoints with pagination.
- **OpenAPI / Swagger UI** — Full auto-generated documentation at `/swagger-ui/index.html`. JWT Bearer authorization supported. Live "try it out" for every endpoint.
- **Benefits Domain API** — Complete CRUD for benefit packages (Health, Dental, Vision, Life, Wellness, Financial). Enrollment and unenrollment logic for employees.
- **Live Analytics Dashboard** — React frontend showing request volume over 7 days, top endpoints, rate limit status, active API keys, and a live request log feed.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend Framework | Spring Boot | 3.2.5 |
| Language | Java | 17 |
| Build Tool | Maven | 3.8+ |
| Database | MongoDB | Atlas (Cloud) |
| Authentication | Spring Security + JWT (jjwt) | 0.12.3 |
| API Docs | SpringDoc OpenAPI | 2.3.0 |
| Frontend Framework | React | 18.2 |
| Bundler | Vite | 5.x |
| Styling | Tailwind CSS | 3.4 |
| Charts | Recharts | 2.x |
| HTTP Client | Axios | 1.x |
| Containerization | Docker | — |
| Backend Deploy | Railway | — |
| Frontend Deploy | Vercel | — |

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MongoDB (local instance or MongoDB Atlas free tier)
- Maven 3.8+

### Backend Setup

```bash
cd backend

# Copy the environment template
cp .env.example .env

# Edit .env and set:
#   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/aeroga
#   JWT_SECRET=your-256-bit-secret-key

mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.  
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Frontend Setup

```bash
cd frontend

npm install

# Copy the environment template
cp .env.example .env

# Edit .env and set:
#   VITE_API_URL=http://localhost:8080

npm run dev
```

The React app will be available at `http://localhost:5173`.

---

## API Reference

| Method | Path | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register a new user |
| POST | `/api/auth/login` | None | Login and receive JWT |
| GET | `/api/auth/me` | JWT | Get current user info |
| GET | `/api/admin/keys` | JWT (Admin) | List API keys |
| POST | `/api/admin/keys` | JWT (Admin) | Create API key |
| PUT | `/api/admin/keys/{id}` | JWT (Admin) | Update API key |
| DELETE | `/api/admin/keys/{id}` | JWT (Admin) | Delete/deactivate API key |
| GET | `/api/admin/analytics/summary` | JWT (Admin) | Get analytics summary |
| GET | `/api/admin/analytics/requests-over-time` | JWT (Admin) | Request volume per day (7 days) |
| GET | `/api/admin/analytics/top-endpoints` | JWT (Admin) | Top 5 endpoints by call count |
| GET | `/api/admin/logs` | JWT (Admin) | Paginated request logs |
| GET | `/api/benefits` | JWT or API Key | List all active benefits |
| GET | `/api/benefits/{id}` | JWT | Get benefit by ID |
| POST | `/api/benefits` | JWT (Admin) | Create benefit |
| PUT | `/api/benefits/{id}` | JWT (Admin) | Update benefit |
| DELETE | `/api/benefits/{id}` | JWT (Admin) | Deactivate benefit |
| GET | `/api/employees` | JWT | List all active employees |
| GET | `/api/employees/{id}` | JWT | Get employee by ID |
| POST | `/api/employees` | JWT (Admin) | Create employee |
| PUT | `/api/employees/{id}` | JWT (Admin) | Update employee |
| DELETE | `/api/employees/{id}` | JWT (Admin) | Deactivate employee |
| POST | `/api/employees/{id}/enroll` | JWT (Admin) | Enroll employee in a benefit |
| DELETE | `/api/employees/{id}/benefits/{benefitId}` | JWT (Admin) | Remove benefit enrollment |
| GET | `/api/employees/{id}/benefits` | JWT | Get enrolled benefits |

---

## Environment Variables

### Backend

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/aeroga` |
| `JWT_SECRET` | HS256 signing key (min 256 bits) | Insecure dev default |

### Frontend

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:8080` |

---

## Seed Data

After starting both services, seed the database with initial data:

**1. Register an admin user:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@aeroga.dev","password":"Admin1234!","role":"ADMIN"}'
```

**2. Login to get JWT:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aeroga.dev","password":"Admin1234!"}'
# Copy the token from the response
```

**3. Create 3 API keys:**
```bash
curl -X POST http://localhost:8080/api/admin/keys \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Production Key","clientName":"Acme Corp","requestsPerMinute":100}'
```

**4. Create 5 sample benefits:**
```bash
curl -X POST http://localhost:8080/api/benefits \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Health Insurance Premium","description":"Full medical coverage","type":"HEALTH","value":500,"currency":"USD","active":true}'
```

**5. Create 5 employees:**
```bash
curl -X POST http://localhost:8080/api/employees \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Johnson","email":"alice@acme.com","department":"Engineering","position":"Senior Developer"}'
```

**6. Enroll employees in benefits:**
```bash
curl -X POST http://localhost:8080/api/employees/<EMPLOYEE_ID>/enroll \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"benefitId":"<BENEFIT_ID>"}'
```

---

## Deployment

### Backend → Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in the Railway dashboard:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a secure 256-bit random string
3. Railway detects the `Dockerfile` automatically and builds the container
4. Note your Railway URL (e.g., `https://aeroga-production.up.railway.app`)

### Frontend → Vercel

1. Import the `frontend/` directory to Vercel (or the full repo and set the root to `frontend/`)
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-railway-url.up.railway.app`
5. Deploy — Vercel handles CDN distribution automatically

---

## Team — VERPTO

| Name | Role | Responsibilities |
|---|---|---|
| **Jashmine Verdida** | Lead QA & Frontend Engineer | React dashboard, Landing page, component architecture, QA processes, end-to-end user experience |
| **Eijay Pepito** | Backend Engineer | Spring Boot API gateway, MongoDB data layer, JWT auth system, rate limiting engine, request logging, API design |

---

## License

MIT — Copyright © 2025 VERPTO
