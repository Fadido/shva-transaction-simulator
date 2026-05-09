# Transaction Approval Simulator

A simulator that determines whether a transaction would be approved or rejected based on the local banking hours of the selected region (Israel, France, USA, Japan). The user picks a region and a time; the backend converts the submitted UTC instant to the region's local time and approves the transaction if it falls within 08:00 - 18:00. Both approved and rejected attempts are persisted; the bottom of the page lists the approved ones.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript, Vite, Tailwind CSS, react-i18next, Zustand, Axios, React Router |
| Backend  | .NET 10 Web API (controllers), EF Core 9, ASP.NET Core Identity + JWT, Swashbuckle, NodaTime |
| Database | Microsoft SQL Server 2022 |
| Container | Docker Compose (mssql + server + nginx-served client) |

## Repository layout

```
.
├── client/                    Vite + React + TS frontend
├── server/
│   ├── Shva.Api/              ASP.NET Core Web API host
│   ├── Shva.Application/      Business logic (banking-hours rule, DTOs, NodaTime)
│   ├── Shva.Domain/           Entities & enums
│   ├── Shva.Infrastructure/   EF Core DbContext, Identity, TransactionService
│   └── Shva.Application.Tests xUnit tests for the banking-hours rule
├── docker-compose.yml
└── README.md
```

---

# Setup and run

There are two paths: **Docker (one command)** or **manual** (run each piece on the host).

## Option 1 - Docker (recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows / macOS / Linux), running.

### Run the whole stack
From the repo root:

```bash
docker compose up --build
```

What happens:
1. Pulls the MSSQL 2022 image (~700 MB, first time only).
2. Builds the .NET API image (multi-stage SDK -> ASP.NET runtime).
3. Builds the client image (Vite build -> nginx).
4. Starts MSSQL, waits for its healthcheck (`SELECT 1`).
5. Starts the API; on startup it retries up to 30 times waiting for MSSQL, then **auto-applies EF Core migrations** (creates `ShvaSimulator` database + tables).
6. Starts nginx serving the React build, with `/api/*` reverse-proxied to the API.

When you see `Now listening on: http://[::]:8080` from the `shva-server` container, the stack is ready.

### URLs
- App: http://localhost:3000
- Swagger / API docs: http://localhost:5000/swagger
- Health check: http://localhost:5000/health

### Stop / clean up
```bash
docker compose down          # stop containers, keep DB data
docker compose down -v       # stop containers AND wipe the database
```

---

## Option 2 - Manual setup (without Docker)

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- A running MSSQL instance (Docker, LocalDB, SQL Server Express, etc.)

### 1. Set up the database

The app expects a SQL Server instance reachable from the API. Three common options:

**a) Start only the MSSQL container from compose**
```bash
docker compose up -d mssql
```
Connection string already matches what's in `appsettings.json` - no changes needed.

**b) Use SQL Server LocalDB** (Windows, comes with Visual Studio)
Edit `server/Shva.Api/appsettings.json` and set:
```json
"ConnectionStrings": {
  "Default": "Server=(localdb)\\MSSQLLocalDB;Database=ShvaSimulator;Trusted_Connection=True;TrustServerCertificate=True"
}
```

**c) Use any other SQL Server**
Update `server/Shva.Api/appsettings.json` with your connection string.

### 2. Apply database migrations

The API auto-applies migrations at startup, so **you do not need to run this manually** in normal use. If you want to apply them ahead of time or inspect them:

```bash
cd server
dotnet tool install --global dotnet-ef --version 9.0.0    # one time only
dotnet ef database update --project Shva.Infrastructure --startup-project Shva.Api
```

To create a new migration after a model change:
```bash
dotnet ef migrations add <MigrationName> \
  --project Shva.Infrastructure --startup-project Shva.Api \
  --output-dir Migrations
```

### 3. Run the backend

```bash
cd server
dotnet run --project Shva.Api
```
- Listens on `http://localhost:5000`
- Swagger at `http://localhost:5000/swagger`
- Migrations are applied on startup automatically

### 4. Run the frontend

```bash
cd client
npm install
npm run dev
```
- Vite dev server at `http://localhost:5173`
- `/api/*` is proxied to `http://localhost:5000` (override with `VITE_API_PROXY`)

---

## Using the app

1. Open the client URL.
2. Sign up with any email + password (>= 6 chars). You're logged in automatically and a JWT is stored in `localStorage`.
3. Pick a region (Israel, France, USA, Japan).
4. Pick a time using the hour/minute picker.
5. Click **OK** to submit. You'll see Approved (green) or Rejected (red).
6. Approved transactions appear in the cards section below.
7. Top-right toggle switches between EN and HE (Hebrew). The whole layout flips to RTL.

## Default test credentials
There is no seeded user - sign up with any email + password (>= 6 chars).

---

# API reference

| Method | Route | Body | Auth | Returns |
|---|---|---|---|---|
| POST | `/api/auth/signup` | `{ email, password }` | public | `{ token, email }` |
| POST | `/api/auth/login`  | `{ email, password }` | public | `{ token, email }` |
| POST | `/api/transactions` | `{ region, submittedAtUtc }` | Bearer | `{ id, region, submittedAtUtc, localTime, status }` |
| GET  | `/api/transactions/approved` | - | Bearer | array of the same shape, only Approved |

Region codes: `IL`, `FR`, `US`, `JP`.

Full interactive schema: http://localhost:5000/swagger

To call protected endpoints from Swagger:
1. Hit `/api/auth/signup` or `/api/auth/login`, copy the returned `token`.
2. Click **Authorize** at the top, enter `Bearer <token>` (with the word `Bearer`).
3. The lock icon turns closed - the protected endpoints now work.

# Banking-hours rule

The submitted time is interpreted as a **UTC instant** (a moment in time). The backend converts it to the wall-clock time in the selected region using IANA time zone data via NodaTime:

| Region | IANA zone |
|---|---|
| IL | `Asia/Jerusalem` |
| FR | `Europe/Paris` |
| US | `America/New_York` |
| JP | `Asia/Tokyo` |

A transaction is **Approved** if the converted local hour `h` satisfies `8 <= h < 18`, otherwise **Rejected**. Both Approved and Rejected transactions are persisted; the approved-transactions endpoint filters to status = Approved.

The implementation lives in `server/Shva.Application/BankingHoursPolicy.cs` and is covered by 11 xUnit tests in `server/Shva.Application.Tests/BankingHoursPolicyTests.cs`. Run them with:

```bash
cd server
dotnet test
```

# Documented assumptions

- **Time interpretation.** `submittedAtUtc` is the UTC instant. The frontend constructs it from today's UTC date plus the picked hour:minute and sends it as an ISO string. The backend converts that instant to local time in the selected region and applies the banking-hours rule.
- **US time zone.** "USA" is treated as Eastern Time (`America/New_York`).
- **JWT in localStorage.** Acceptable for a demo; production should use httpOnly cookies and refresh tokens.
- **Identity password policy.** Relaxed (min 6 chars, no symbol/digit requirement) for ease of demo signup.
- **Dev secrets.** The MSSQL SA password and JWT signing key in `docker-compose.yml` and `appsettings.json` are dev placeholders. In production they should come from a secrets manager (Azure Key Vault, AWS Secrets Manager, environment variables, etc.).

# Loom video

Short walkthrough: https://www.loom.com/share/75d50530be474c3c9f7f0bc2ff10a0a7
