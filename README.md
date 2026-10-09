# CareerFlow — Full-Stack Job Application Tracker (MERN)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-4.x-black?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20%7C%20Jest%20(Passing)-brightgreen?logo=jest&logoColor=white)](https://jestjs.io/)
[![Built with Kiro](https://img.shields.io/badge/Built%20with-Kiro%20AI-blueviolet)](https://app.kiro.de/)

> A modern, responsive, full-stack **MERN** application built for job seekers to manage, organize, and track their applications across every stage of the hiring pipeline. Developed using **Kiro** following a structured **Specification-Driven Development (SDD)** methodology.

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Project Architecture & Structure](#-project-architecture--structure)
- [Setup & Installation](#-setup--installation)
- [How to Run](#-how-to-run)
- [Running the Test Suites](#-running-the-test-suites)
- [AI Tool Usage: Kiro](#-ai-development-tool--experience-kiro)
  - [Overview & Methodology](#overview--methodology)
  - [3–5 Specific Tasks Accelerated by Kiro](#35-specific-tasks-accelerated-by-kiro)
- [Evaluation Checklist](#-evaluation-checklist)

---

## 🌟 Project Overview

**CareerFlow** simplifies the modern job hunt. When applying to multiple roles across various platforms, candidates frequently lose track of dates, referral links, interview statuses, and follow-up notes. CareerFlow provides a single source of truth featuring:
1. **Live Analytics**: Instant overview of your total application funnel (Applied, Interview, Selected, Rejected).
2. **Instant Search & Filter**: Rapid multi-criteria filtering by company, position title, and interview status.
3. **Resilient Data Integrity**: End-to-end client and server validation ensuring clean, dependable records.
4. **Fluid UI/UX**: Premium, dark-mode-ready interface engineered with clean CSS tokens, smooth micro-interactions, and accessible forms.

---

## ✨ Key Features

- **Full Application Lifecycle Tracking (CRUD)**:
  - Add new applications with company name, job title/position, status, application date, job URL, and notes.
  - Edit existing records with pre-populated form values and real-time updates.
  - Delete records with defensive confirmation prompts to prevent accidental loss.
- **Real-Time Analytics Dashboard**:
  - Live metric counter cards calculating `Total`, `Applied`, `Interview`, `Selected`, and `Rejected` statuses.
  - Backend counts are computed asynchronously via parallel MongoDB document aggregation (`$countDocuments`).
  - Automatically re-synchronizes after any create, update, or delete action.
- **Client-Side Search & Filtering**:
  - Real-time search across `company` and `position` strings.
  - Status dropdown selector (`All`, `Applied`, `Interview`, `Selected`, `Rejected`).
  - Derived reactive state: filters execute in memory without redundant API calls.
- **Defensive Validation & Error Handling**:
  - Frontend client-side validation flags blank required fields and checks HTTP/HTTPS URL syntax with friendly inline warnings.
  - Backend Mongoose schema constraints validate enum states and trim inputs.
  - Centralized Express error handler catches unexpected exceptions and cast errors cleanly.
- **Modern, Accessible UI/UX**:
  - Custom CSS variables design system with curated HSL color palettes, subtle glassmorphic surfaces, badges, and responsive grid layouts.
  - Graceful empty-state feedback when search or filters return zero matches.

---

## 🛠️ Technologies Used

### Frontend
- **React 18**: Component-based UI with declarative state and lifecycle hooks (`useState`, `useEffect`, `useCallback`).
- **Vite**: Ultra-fast module bundling and hot-module replacement (HMR).
- **Vanilla CSS (Design System)**: Bespoke styling using modern CSS variables, responsive CSS Grid / Flexbox, glassmorphic card overlays, and fluid transitions (zero bloated CSS framework dependencies).
- **Testing**:
  - **Vitest**: High-performance test runner compatible with Vite.
  - **React Testing Library**: Accessible DOM testing simulating real user actions.
  - **fast-check**: Property-based invariant testing.
  - **jsdom**: In-memory browser simulation environment.

### Backend
- **Node.js & Express.js**: RESTful API service with route separation and centralized middleware.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) with strict schema validation, default values, and timestamps.
- **Testing**:
  - **Jest**: Backend test suite runner.
  - **Supertest**: HTTP assertion library for endpoint testing.
  - **mongodb-memory-server**: Isolated, ephemeral in-memory MongoDB database for fast, side-effect-free integration tests.
  - **fast-check**: Randomized property-based validation and roundtrip tests.

### Development & Tooling
- **Kiro AI**: Specification-driven development, requirements formulation, architectural design, and debugging assistance.
- **Oxlint**: High-speed JavaScript/JSX static analysis ensuring strict code hygiene.

---

## 📂 Project Architecture & Structure

```
StartupMeu/
├── .gitignore                      # Top-level gitignore (excludes node_modules, .env, dist)
├── .kiro/                          # Kiro AI Specification Workspace
│   └── specs/careerflow/
│       ├── .config.kiro            # Kiro specification metadata
│       └── requirements.md         # Detailed system requirements
├── careerflow/
│   ├── .kiro/                      # Full project specification files
│   │   └── specs/careerflow/
│   │       ├── requirements.md     # E2E functional & non-functional requirements
│   │       ├── design.md           # Architecture, data schemas, API contracts & UI design
│   │       ├── tasks.md            # Structured 15-task development plan with test properties
│   │       └── tasks.meta.json     # Machine-readable task tracking metadata
│   ├── package.json                # Workspace script aggregator
│   ├── backend/
│   │   ├── controllers/
│   │   │   └── applicationController.js  # CRUD & analytics controllers
│   │   ├── middleware/
│   │   │   └── errorHandler.js           # Centralized Express error handler
│   │   ├── models/
│   │   │   └── Application.js            # Mongoose Application model & validation
│   │   ├── routes/
│   │   │   └── applicationRoutes.js      # RESTful API route definitions
│   │   ├── tests/
│   │   │   └── integration/
│   │   │       └── lifecycle.test.js     # E2E CRUD lifecycle & property tests
│   │   ├── .env.example                  # Template environment configuration
│   │   ├── package.json                  # Backend dependencies & test scripts
│   │   └── server.js                     # Express app initialization & DB connection
│   └── frontend/
│       ├── public/                       # Static public assets (icons, favicons)
│       ├── src/
│       │   ├── __tests__/                # Vitest unit & component test suites
│       │   │   ├── Application_Card.test.jsx
│       │   │   ├── Application_Form.test.jsx
│       │   │   ├── Application_List.test.jsx
│       │   │   ├── Stats_Panel.test.jsx
│       │   │   ├── filterApplications.test.js
│       │   │   └── validation.test.js
│       │   ├── assets/                   # Vector graphics & illustration assets
│       │   ├── components/               # Modular UI components
│       │   │   ├── Application_Card.jsx  # Individual job card with actions
│       │   │   ├── Application_Form.jsx  # Create/Edit form with inline validation
│       │   │   ├── Application_List.jsx  # Grid/list container with empty states
│       │   │   ├── SearchBar.jsx         # Debounced text search
│       │   │   ├── StatCard.jsx          # Individual KPI card
│       │   │   ├── Stats_Panel.jsx       # Analytics dashboard banner
│       │   │   └── StatusFilter.jsx      # Status dropdown selector
│       │   ├── services/
│       │   │   └── applicationService.js # Fetch API client with error handling
│       │   ├── utils/
│       │   │   ├── filterApplications.js # Pure filter & search predicates
│       │   │   └── validation.js         # URL & non-blank string validators
│       │   ├── App.css                   # Custom responsive design system
│       │   ├── App.jsx                   # Root application state & coordination
│       │   ├── index.css                 # Base resets, typography & CSS tokens
│       │   ├── main.jsx                  # React DOM mount point
│       │   └── setupTests.js             # Vitest test setup with jest-dom
│       ├── index.html                    # HTML entry point with meta tags
│       ├── package.json                  # Frontend dependencies & test scripts
│       └── vite.config.js                # Vite build configuration & API proxy
└── README.md                       # Comprehensive project documentation
```

---

## ⚡ Setup & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: A running local MongoDB instance (`mongodb://127.0.0.1:27017/careerflow`) or a MongoDB Atlas connection string.

### 1. Clone the Repository
```bash
git clone https://github.com/RahulNaikMudavath/StartupMeu.git
cd StartupMeu
```

### 2. Backend Setup
```bash
cd careerflow/backend

# Install dependencies
npm install

# Configure environment variables
# A template .env.example is provided:
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/careerflow
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install
```

---

## 🚀 How to Run

### Method 1: Running Concurrently / In Two Terminals

#### Terminal 1 — Start the Backend API
```bash
cd careerflow/backend
npm run dev
```
*The Express server will start on [http://localhost:5000](http://localhost:5000) and connect to MongoDB.*

#### Terminal 2 — Start the Frontend Dev Server
```bash
cd careerflow/frontend
npm run dev
```
*The Vite development server will start on [http://localhost:5173](http://localhost:5173).*
*Open your browser and navigate to `http://localhost:5173/`.*

---

## 🧪 Running the Test Suites

CareerFlow includes comprehensive automated testing across both backend and frontend layers:

### Backend Tests (Jest + Supertest + In-Memory MongoDB)
Verifies full CRUD lifecycle, status count updates, route priority ordering (`/stats` vs `/:id`), and property-based data invariance:
```bash
cd careerflow/backend
npm test
```
*Expected result: 8/8 tests passing.*

### Frontend Tests (Vitest + React Testing Library)
Verifies component rendering, user interactions, form validation, filter logic, and status card displays:
```bash
cd careerflow/frontend
npm test
```
*Expected result: 6 test suites, 24/24 tests passing.*

### Frontend Linting & Production Build
```bash
cd careerflow/frontend

# Fast static analysis
npx oxlint

# Production build check
npm run build
```

---

## 🤖 AI Development Tool & Experience: Kiro

### Overview & Methodology
During the development of CareerFlow, **[Kiro](https://app.kiro.de/)** was utilized as the primary AI development tool. Rather than treating AI as a simple code autocomplete engine, we adopted a **Specification-Driven Development (SDD)** workflow enabled by Kiro:

1. **Spec Generation (`.kiro/specs/careerflow/`)**:
   - Before writing code, Kiro was used to draft rigorous specification artifacts:
     - [`requirements.md`](careerflow/.kiro/specs/careerflow/requirements.md): Exhaustive enumeration of functional and non-functional requirements, with unique numbered requirement IDs (e.g., Req 1.1–10.6).
     - [`design.md`](careerflow/.kiro/specs/careerflow/design.md): System architecture, REST API route contracts, Mongoose schema constraints, frontend component tree, and formal correctness properties.
     - [`tasks.md`](careerflow/.kiro/specs/careerflow/tasks.md): An incremental 15-task development plan mapping subtasks to requirement IDs and property-based verification checks.
2. **Spec Adherence & Guardrails**:
   - Development progressed phase-by-phase following the task matrix.
   - Any refactoring was vetted against the design constraints to prevent scope drift or regression.

---

### 3–5 Specific Tasks Accelerated by Kiro

#### 1. Specification & Task Decomposition (Architecture Planning)
- **What was done**: Kiro broke down the MERN project from high-level user stories into an incremental 15-step blueprint in [`tasks.md`](careerflow/.kiro/specs/careerflow/tasks.md).
- **Impact**: Allowed the project to be executed feature-by-feature in logical, modular chunks with dedicated checkpoints, ensuring no edge case (such as route precedence or cast errors) was omitted.

#### 2. Backend Controller & MongoDB Aggregation Optimization
- **What was done**: Kiro formulated the `getStats` controller in [`applicationController.js`](careerflow/backend/controllers/applicationController.js) to run five parallel count operations via `Promise.all([Application.countDocuments(...)])` rather than pulling all records into memory or running serial roundtrips.
- **Impact**: Delivered $O(1)$ memory consumption and reduced database latency for dashboard metric calculations.

#### 3. Frontend Component Modularization & Reactive State Architecture
- **What was done**: Designed a modular component hierarchy (`Stats_Panel`, `Application_Card`, `Application_List`, `Application_Form`, `SearchBar`, `StatusFilter`). Kiro guided the state design in [`App.jsx`](careerflow/frontend/src/App.jsx) so that search queries and filter selections derive the visible list dynamically in-memory without making redundant backend requests.
- **Impact**: High UI responsiveness with instant zero-latency filtering, while preserving data synchronization with the server on CRUD mutations.

#### 4. Critical Debugging: Resolving MongoDB 7.7.0 ESM / Jest VM Environment Hang
- **What was done**: During backend integration testing ([Task 14.1](careerflow/.kiro/specs/careerflow/tasks.md)), the test suite hung due to a known conflict where MongoDB driver 7.7+ uses dynamic `await import('os')` inside Jest's simulated VM context.
- **Problem Solving with Kiro**: Instead of unsustainably modifying files inside `node_modules`, we investigated the driver internals and determined that `mongoose.connect()` accepts custom runtime adapters. We supplied `{ runtimeAdapters: { os } }` directly inside [`lifecycle.test.js`](careerflow/backend/tests/integration/lifecycle.test.js), achieving a clean, permanent, zero-hack fix that restored instant test execution.

#### 5. Property-Based Testing & Quality Assurance
- **What was done**: Using `fast-check` alongside Jest and Vitest, Kiro designed invariant round-trip property tests (generating 100 randomized payloads per run) to guarantee that arbitrary valid characters, UTF-8 positions, and timestamps survive the full API and database serialization lifecycle without mutation or loss.
- **Impact**: High test confidence beyond standard happy-path unit tests.

---

## 📋 Evaluation Checklist

| Evaluation Criterion | Implementation Details |
| :--- | :--- |
| **MERN Skills** | Clean React 18 frontend with custom design tokens, robust Express REST API, Mongoose ODM schemas, and MongoDB parallel aggregation. |
| **Code Quality** | Modular folder structure, consistent naming conventions, zero lint warnings via Oxlint, separated services, and centralized error handling. |
| **AI Tool Usage (Kiro)** | Comprehensive specification documents in `.kiro/specs/careerflow/`, task-based execution, and structured prompt engineering. |
| **Problem Solving** | Permanent fix for MongoDB driver ESM / Jest VM adapter hang without touching `node_modules`; robust client & server validation. |
| **GitHub Organization** | Granular feature-by-feature git commits, complete README documentation, and strict `.gitignore` configurations. |
| **Test Coverage** | 8 backend integration & property tests passing + 24 frontend component & unit tests passing. |

---

## 👤 Author & Contact
- **Developer**: Rahul Naik Mudavath
- **Email**: [rahulnaikm2003@gmail.com](mailto:rahulnaikm2003@gmail.com)
- **Repository**: [https://github.com/RahulNaikMudavath/StartupMeu](https://github.com/RahulNaikMudavath/StartupMeu)
- **Organization Submission**: StartupMeu Evaluation Task
