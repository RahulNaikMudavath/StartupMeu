# Implementation Plan: CareerFlow

## Overview

Full-stack MERN application for tracking job and internship applications. The implementation proceeds in four phases: project scaffolding, backend API, frontend UI, and a final integration/wiring pass. Property-based tests (fast-check) and unit tests are included as optional sub-tasks throughout.

---

## Tasks

- [x] 1. Scaffold project structure
  - Create `careerflow/backend/` and `careerflow/frontend/` root directories
  - Inside `backend/`, create sub-directories: `controllers/`, `middleware/`, `models/`, `routes/`
  - Inside `frontend/src/`, create sub-directories: `components/`, `services/`
  - Initialize `backend/package.json` with dependencies: `express`, `mongoose`, `cors`, `dotenv`; devDependencies: `jest`, `supertest`, `fast-check`, `mongodb-memory-server`, `nodemon`
  - Initialize `frontend/` as a Vite + React project (`npm create vite@latest frontend -- --template react`); add devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `fast-check`, `jsdom`
  - _Requirements: 9.1, 10.1, 10.2_

---

- [x] 2. Backend — Application Mongoose model
  - [x] 2.1 Create `backend/models/Application.js`
    - Define Mongoose schema with fields: `company` (String, required, trim), `position` (String, required, trim), `status` (String, enum `['Applied','Interview','Selected','Rejected']`, required, default `'Applied'`), `applicationDate` (Date, required), `jobUrl` (String, trim, default `''`), `notes` (String, trim, default `''`)
    - Enable `{ timestamps: true }` option
    - Export the `Application` model
    - _Requirements: 9.2, 1.1, 1.2, 1.3_

  - [ ]* 2.2 Write property test for Application model validation
    - **Property 1: Valid POST returns created record** — assert that saving a document with all required fields succeeds and persists correct field values
    - **Property 2: Missing required field returns 400** — assert that saving a document missing any required field throws a Mongoose `ValidationError`
    - Use `mongodb-memory-server` for isolation
    - _Requirements: 1.1, 1.5_

---

- [x] 3. Backend — Express server and DB connection
  - [x] 3.1 Create `backend/server.js`
    - Initialize Express app with `express.json()` and `cors()` middleware
    - Load environment variables via `dotenv`
    - Connect to MongoDB using `mongoose.connect(process.env.MONGO_URI)`; log success or log error and call `process.exit(1)` on failure
    - Mount application routes at `/api/applications`
    - Register global error-handler middleware (imported from `middleware/errorHandler.js`) as the last middleware
    - Start the server on `process.env.PORT` (default `5000`)
    - _Requirements: 9.1, 9.3, 9.4_

  - [x] 3.2 Create `backend/middleware/errorHandler.js`
    - Export a four-argument Express error-handling function `(err, req, res, next)`
    - Log `err.stack` to the console
    - Respond with HTTP 500 and `{ message: 'Internal server error' }`
    - _Requirements: 9.4, 9.5_

---

- [x] 4. Backend — Application controller
  - [x] 4.1 Create `backend/controllers/applicationController.js` — `getAllApplications`
    - Export `getAllApplications`: query `Application.find({})`, return 200 with the array; catch errors and call `next(err)`
    - _Requirements: 2.2, 9.5_

  - [x] 4.2 Create `getStats` controller function
    - Export `getStats`: run five `Application.countDocuments()` calls in parallel (total, applied, interview, selected, rejected); return 200 with `{ total, applied, interview, selected, rejected }`; catch errors and call `next(err)`
    - _Requirements: 8.2, 9.5_

  - [ ]* 4.3 Write property test for `getStats`
    - **Property 15: Stats counts match actual data** — insert an arbitrary array of applications, call `GET /api/applications/stats`, assert counts match
    - Use `mongodb-memory-server` and `supertest`; minimum 100 iterations
    - _Requirements: 8.2_

  - [x] 4.4 Create `getApplicationById` controller function
    - Export `getApplicationById`: find by `req.params.id`; if null return 404 `{ message: 'Application not found' }`; else return 200 with the document; handle `CastError` → 404; forward other errors to `next(err)`
    - _Requirements: 3.2, 3.3, 9.5_

  - [x] 4.5 Create `createApplication` controller function
    - Export `createApplication`: construct a new `Application` from `req.body`, call `.save()`, return 201 with the saved document; catch `ValidationError` → 400 with `err.message`; forward others to `next(err)`
    - _Requirements: 1.1, 1.5, 9.5_

  - [ ]* 4.6 Write property test for `createApplication`
    - **Property 1: Valid POST returns created record** — for arbitrary valid payloads, assert 201 and matching body fields
    - **Property 2: Missing required field returns 400** — for payloads missing any required field, assert 400
    - Use `mongodb-memory-server` and `supertest`; minimum 100 iterations
    - _Requirements: 1.1, 1.5_

  - [x] 4.7 Create `updateApplication` controller function
    - Export `updateApplication`: call `Application.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })`; if null return 404; else return 200 with the updated document; catch `ValidationError` → 400; `CastError` → 404; forward others to `next(err)`
    - _Requirements: 4.2, 4.4, 9.5_

  - [ ]* 4.8 Write property test for `updateApplication`
    - **Property 10: PUT returns updated record** — insert an application, send an arbitrary valid partial update, assert 200 and that response body reflects updated fields while preserving unchanged fields
    - Use `mongodb-memory-server` and `supertest`; minimum 100 iterations
    - _Requirements: 4.2_

  - [x] 4.9 Create `deleteApplication` controller function
    - Export `deleteApplication`: call `Application.findByIdAndDelete(id)`; if null return 404; else return 200 with `{ message: 'Application deleted successfully' }`; handle `CastError` → 404; forward others to `next(err)`
    - _Requirements: 5.2, 5.3, 9.5_

---

- [x] 5. Backend — Routes
  - [x] 5.1 Create `backend/routes/applicationRoutes.js`
    - Import all six controller functions
    - Register routes in this order: `GET /stats` (before `/:id`), `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`
    - Export the router
    - _Requirements: 8.1, 2.2, 3.1, 1.1, 4.1, 5.1, 9.1_

  - [ ]* 5.2 Write backend unit tests for route ordering and controller integration
    - Assert `GET /api/applications/stats` resolves before `/:id` (confirm literal `stats` is not treated as an id)
    - Assert `GET /api/applications` returns all inserted documents (example test with two documents)
    - Assert `POST /api/applications` with valid body returns 201
    - Assert `POST /api/applications` with missing field returns 400
    - Assert `GET /api/applications/:id` returns 404 for unknown id
    - Use `mongodb-memory-server` and `supertest`
    - _Requirements: 8.1, 2.2, 1.1, 1.5, 3.3_

  - [ ]* 5.3 Write property test for `getAllApplications`
    - **Property 6: GET retrieves all inserted records** — insert N arbitrary documents, call `GET /api/applications`, assert response array length equals N and all `_id`s are present
    - Use `mongodb-memory-server` and `supertest`; minimum 100 iterations
    - _Requirements: 2.2_

  - [ ]* 5.4 Write property test for `getApplicationById`
    - **Property 8: GET /:id round-trip** — insert an arbitrary application, retrieve it by `_id`, assert all fields match
    - Use `mongodb-memory-server` and `supertest`; minimum 100 iterations
    - _Requirements: 3.2_

- [x] 6. Backend checkpoint — Ensure all backend tests pass
  - Run `npm test` inside `backend/`; resolve any failures before proceeding.

---

- [x] 7. Frontend — Vite config and service layer
  - [x] 7.1 Configure `frontend/vite.config.js`
    - Add a `server.proxy` entry that forwards `/api` requests to `http://localhost:5000` (target, changeOrigin true, secure false)
    - Configure `test` block: `environment: 'jsdom'`, `setupFiles: ['./src/setupTests.js']`
    - _Requirements: 10.1_

  - [x] 7.2 Create `frontend/src/setupTests.js`
    - Import `@testing-library/jest-dom` to extend Vitest matchers

  - [x] 7.3 Create `frontend/src/services/applicationService.js`
    - Implement and export: `fetchAll`, `fetchStats`, `fetchById`, `createApplication`, `updateApplication`, `deleteApplication`
    - Implement `handleResponse(res)`: parse JSON body; if `!res.ok` throw `new Error(body.message || 'Unexpected error')`; else return body
    - All functions use the native Fetch API with `BASE_URL = '/api/applications'`
    - _Requirements: 10.1, 2.1, 8.1, 3.1, 1.1, 4.1, 5.1_

---

- [x] 8. Frontend — Utility functions
  - [x] 8.1 Create `frontend/src/utils/filterApplications.js`
    - Export `filterApplications(applications, searchText, statusFilter)`:
      - Filter by status (skip if `'All'`)
      - Filter by case-insensitive substring match on `company` or `position`
      - Return the resulting array
    - _Requirements: 6.1, 6.4, 7.1, 7.2, 7.4_

  - [ ]* 8.2 Write property tests for `filterApplications`
    - **Property 11: Search filter inclusion and exclusion** — for arbitrary arrays and search strings, assert result contains exactly the matching items
    - **Property 12: Search filter round-trip** — applying search then clearing (empty string) returns original array
    - **Property 13: Status filter inclusion and exclusion** — for arbitrary arrays and a status value, assert result contains exactly items with that status
    - **Property 14: Combined filter equals intersection** — combined result equals intersection of each filter applied independently
    - Use `fast-check`; minimum 100 iterations per property
    - _Requirements: 6.1, 6.4, 7.1, 7.4_

  - [x] 8.3 Create `frontend/src/utils/validation.js`
    - Export `isValidUrl(value)`: return `true` if value is falsy (optional field) or parseable by `new URL(value)`; otherwise `false`
    - Export `isNonBlank(value)`: return `true` if `value.trim().length > 0`
    - _Requirements: 1.4, 1.6_

  - [ ]* 8.4 Write property tests for validation utilities
    - **Property 4: URL validator accepts valid URLs and rejects invalid ones** — for arbitrary strings, assert `isValidUrl` returns same result as `new URL(s)` not throwing
    - **Property 3: Whitespace-only strings are invalid** — for strings composed entirely of whitespace, assert `isNonBlank` returns `false`
    - Use `fast-check`; minimum 100 iterations per property
    - _Requirements: 1.4, 1.6_

---

- [x] 9. Frontend — Presentational components
  - [x] 9.1 Create `frontend/src/components/StatCard.jsx`
    - Purely presentational; accepts `label` and `count` props; renders both values
    - _Requirements: 8.3_

  - [x] 9.2 Create `frontend/src/components/Stats_Panel.jsx`
    - Accepts `stats`, `loading`, `error` props
    - While `loading` is true, render a loading indicator
    - If `error` is set, render an error message instead of stats
    - Otherwise render five `StatCard`s (total, applied, interview, selected, rejected)
    - _Requirements: 8.3, 8.4, 8.5_

  - [x]* 9.3 Write unit tests for `Stats_Panel`
    - Test: shows loading indicator when `loading={true}`
    - Test: shows error message when `error` is set
    - Test: renders all five `StatCard`s with correct values when `stats` is provided
    - Use Vitest + React Testing Library
    - _Requirements: 8.3, 8.4, 8.5_

  - [ ]* 9.4 Write property test for `Stats_Panel`
    - **Property 16: Stats_Panel displays all five statistics** — for arbitrary non-negative integer stats objects, assert all five values are rendered in the DOM
    - Use `fast-check` with Vitest + React Testing Library; minimum 100 iterations
    - _Requirements: 8.3_

  - [x] 9.5 Create `frontend/src/components/SearchBar.jsx`
    - Controlled input; accepts `value` and `onSearch` props; calls `onSearch(e.target.value)` on change
    - _Requirements: 6.1_

  - [x] 9.6 Create `frontend/src/components/StatusFilter.jsx`
    - Controlled select with options: `All`, `Applied`, `Interview`, `Selected`, `Rejected`; accepts `value` and `onFilterChange` props
    - _Requirements: 7.1, 7.2_

  - [x] 9.7 Create `frontend/src/components/Application_Card.jsx`
    - Accepts `application`, `onEdit`, `onDelete` props
    - Displays `company`, `position`, `status`, `applicationDate`
    - Provides Edit and Delete affordances (buttons) that call `onEdit(application)` and `onDelete(application._id)`
    - _Requirements: 2.6, 5.5_

  - [x]* 9.8 Write unit tests for `Application_Card`
    - Test: renders `company`, `position`, `status`, `applicationDate`
    - Test: calls `onEdit` when Edit button is clicked
    - Test: calls `onDelete` when Delete button is clicked
    - Use Vitest + React Testing Library
    - _Requirements: 2.6_

  - [ ]* 9.9 Write property test for `Application_Card`
    - **Property 7: Application_Card renders required summary fields** — for arbitrary Application objects, assert `company`, `position`, `status`, and `applicationDate` are all visible in the DOM
    - Use `fast-check` with Vitest + React Testing Library; minimum 100 iterations
    - _Requirements: 2.6_

---

- [x] 10. Frontend — `Application_List` component
  - [x] 10.1 Create `frontend/src/components/Application_List.jsx`
    - Accepts `applications` array prop
    - Renders one `Application_Card` per item (passing `onEdit` and `onDelete` through)
    - When `applications` is empty, renders a distinct empty-state message (`"No applications found"`)
    - _Requirements: 2.1, 2.4, 6.3, 10.6_

  - [x]* 10.2 Write unit tests for `Application_List`
    - Test: renders the correct number of `Application_Card`s for a given array
    - Test: renders empty-state message when array is empty
    - Use Vitest + React Testing Library
    - _Requirements: 2.4, 10.6_

  - [ ]* 10.3 Write property test for `Application_List`
    - **Property 5: Application_List renders exactly what the API returns** — for an arbitrary array of Application objects, assert the rendered list contains exactly that many cards
    - Use `fast-check` with Vitest + React Testing Library; minimum 100 iterations
    - _Requirements: 2.1_

---

- [x] 11. Frontend — `Application_Form` component
  - [x] 11.1 Create `frontend/src/components/Application_Form.jsx`
    - Controlled form managing draft state: `company`, `position`, `status` (default `'Applied'`), `applicationDate`, `jobUrl`, `notes`
    - On submit: validate `company` and `position` are non-blank (using `isNonBlank`); validate `jobUrl` if provided (using `isValidUrl`); display inline error messages and prevent submission on failure
    - When validations pass, call `onSubmit(draftData)`
    - When `editTarget` prop is provided, pre-populate form with its values
    - _Requirements: 1.2, 1.3, 1.4, 1.6, 4.3_

  - [x]* 11.2 Write unit tests for `Application_Form`
    - Test: shows required-field error when `company` is blank on submit
    - Test: shows required-field error when `position` is blank on submit
    - Test: shows URL error when `jobUrl` is malformed on submit
    - Test: calls `onSubmit` with correct data when all fields are valid
    - Use Vitest + React Testing Library
    - _Requirements: 1.4, 1.6_

---

- [x] 12. Frontend — Root `App` component and state management
  - [x] 12.1 Create `frontend/src/App.jsx`
    - Declare all state: `applications`, `stats`, `loading`, `statsLoading`, `error`, `statsError`, `searchText`, `statusFilter`, `selectedId`, `editTarget`
    - On mount, call `fetchAll()` and `fetchStats()` in parallel; update state on resolve/reject with proper loading and error flags
    - Compute `filteredApplications` as a derived constant using `filterApplications(applications, searchText, statusFilter)`
    - Implement `handleCreate(data)`: call `createApplication(data)`, then re-fetch all and stats
    - Implement `handleUpdate(id, data)`: call `updateApplication(id, data)`, then re-fetch all and stats; satisfies Requirement 8.6
    - Implement `handleDelete(id)`: show browser `confirm()` prompt; if confirmed call `deleteApplication(id)`, then re-fetch all and stats; satisfies Requirement 5.5
    - Pass all state and handlers down to child components as props
    - Render: `Stats_Panel`, `SearchBar`, `StatusFilter`, `Application_Form` (for create), and `Application_List`
    - _Requirements: 2.3, 10.3, 10.4, 10.5, 8.6, 5.4, 1.7, 4.5_

  - [ ]* 12.2 Write unit tests for `App` state management
    - Test: `fetchStats` is called after create
    - Test: `fetchStats` is called after update
    - Test: `fetchStats` is called after delete
    - Test: no additional API calls are made when `searchText` or `statusFilter` changes
    - Mock `applicationService` module; use Vitest + React Testing Library
    - _Requirements: 8.6_

  - [x] 12.3 Create `frontend/src/main.jsx`
    - Import and render `<App />` into `document.getElementById('root')`
    - _Requirements: 10.2_

- [x] 13. Frontend checkpoint — Ensure all frontend tests pass
  - Run `npx vitest --run` inside `frontend/`; resolve any failures before proceeding.

---

- [x] 14. Integration — Wire frontend to backend and validate full lifecycle
  - [x] 14.1 Write backend integration test for full CRUD lifecycle
    - Test sequence: create → read → update → delete using `supertest` and `mongodb-memory-server`
    - After each mutation, assert `GET /api/applications/stats` returns updated counts
    - Confirm that `GET /api/applications/stats` takes route priority over `GET /api/applications/:id` when `stats` is used as an id
    - _Requirements: 8.6, 8.1, 1.1, 4.2, 5.2_

  - [x]* 14.2 Write property test for full data roundtrip
    - **Property 8: GET /:id round-trip (integration)** — for arbitrary valid application payloads, create via POST then retrieve via GET /:id and assert all field values match
    - Use `mongodb-memory-server` and `supertest`; minimum 100 iterations
    - _Requirements: 3.2_

- [x] 15. Final checkpoint — Ensure all tests pass
  - Run `npm test` in `backend/` and `npx vitest --run` in `frontend/`
  - Ensure all tests pass; ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 6, 13, and 15 ensure incremental validation
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
- The Vite dev proxy (task 7.1) eliminates CORS issues during local development
- The `GET /api/applications/stats` route must be registered before `GET /api/applications/:id` (task 5.1) to prevent Express from treating the literal string `stats` as a dynamic `:id`
- `mongodb-memory-server` keeps backend tests fully self-contained with no external DB dependency

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "3.2"] },
    { "id": 1, "tasks": ["2.2", "3.1", "4.1", "4.2"] },
    { "id": 2, "tasks": ["4.3", "4.4", "4.5", "4.7", "4.9"] },
    { "id": 3, "tasks": ["4.6", "4.8", "5.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "5.4", "7.1", "7.2", "8.1", "8.3", "9.1"] },
    { "id": 5, "tasks": ["7.3", "8.2", "8.4", "9.2", "9.5", "9.6", "9.7"] },
    { "id": 6, "tasks": ["9.3", "9.4", "9.8", "9.9", "10.1", "11.1"] },
    { "id": 7, "tasks": ["10.2", "10.3", "11.2", "12.1"] },
    { "id": 8, "tasks": ["12.2", "12.3"] },
    { "id": 9, "tasks": ["14.1"] },
    { "id": 10, "tasks": ["14.2"] }
  ]
}
```
