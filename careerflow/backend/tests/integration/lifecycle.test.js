/**
 * Backend integration test — full CRUD lifecycle
 *
 * Requirements: 8.6, 8.1, 1.1, 4.2, 5.2
 *
 * Covers:
 *  - POST /api/applications  → 201, record persisted
 *  - GET  /api/applications/stats after create → counts updated
 *  - GET  /api/applications/:id → 200, fields match
 *  - PUT  /api/applications/:id → 200, body reflects changes
 *  - GET  /api/applications/stats after update → counts still correct
 *  - DELETE /api/applications/:id → 200, confirmation message
 *  - GET  /api/applications/stats after delete → total back to 0
 *  - GET  /api/applications/stats route priority: "stats" NOT treated as /:id
 */

'use strict';

// Increase global timeout — mongodb-memory-server needs ~30 s to extract and
// start the binary on first run after download.
jest.setTimeout(120000);

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');

// Load the Application model so its schema is registered before any test runs.
// This is required for afterEach to call deleteMany() via mongoose.model().
const Application = require('../../models/Application');

// We build a minimal Express app using the same routes and middleware as
// server.js but without calling mongoose.connect() or app.listen().
// This keeps the test fully self-contained.
const cors = require('cors');
const applicationRoutes = require('../../routes/applicationRoutes');
const errorHandler = require('../../middleware/errorHandler');

function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/applications', applicationRoutes);
  app.use(errorHandler);
  return app;
}

let mongod;
let app;

const os = require('os');

beforeAll(async () => {
  // Start in-memory MongoDB
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    runtimeAdapters: { os },
  });

  // Build the Express app (no DB connection, no listen)
  app = buildApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Wipe all documents between test cases for isolation
afterEach(async () => {
  await Application.deleteMany({});
});

// ---------------------------------------------------------------------------
// Helper — fixed valid payload
// ---------------------------------------------------------------------------
const validPayload = () => ({
  company: 'Acme Corp',
  position: 'Software Engineer',
  status: 'Applied',
  applicationDate: '2025-01-15',
  jobUrl: 'https://acme.example.com/jobs/123',
  notes: 'Referred by a friend',
});

// ---------------------------------------------------------------------------
// 1. Full CRUD lifecycle
// ---------------------------------------------------------------------------
describe('Full CRUD lifecycle', () => {
  it('create → stats → read → update → stats → delete → stats', async () => {
    // ── CREATE ──────────────────────────────────────────────────────────────
    const createRes = await request(app)
      .post('/api/applications')
      .send(validPayload())
      .expect(201);

    const created = createRes.body;
    expect(created._id).toBeTruthy();
    expect(created.company).toBe('Acme Corp');
    expect(created.position).toBe('Software Engineer');
    expect(created.status).toBe('Applied');
    expect(created.jobUrl).toBe('https://acme.example.com/jobs/123');
    expect(created.notes).toBe('Referred by a friend');

    const createdId = created._id;

    // ── STATS after create ───────────────────────────────────────────────
    let stats = await request(app).get('/api/applications/stats').expect(200);
    expect(stats.body).toMatchObject({ total: 1, applied: 1, interview: 0, selected: 0, rejected: 0 });

    // ── READ by ID ──────────────────────────────────────────────────────
    const readRes = await request(app)
      .get(`/api/applications/${createdId}`)
      .expect(200);

    expect(readRes.body._id).toBe(createdId);
    expect(readRes.body.company).toBe('Acme Corp');
    expect(readRes.body.status).toBe('Applied');

    // ── UPDATE ──────────────────────────────────────────────────────────
    const updateRes = await request(app)
      .put(`/api/applications/${createdId}`)
      .send({ status: 'Interview', notes: 'Phone screen scheduled' })
      .expect(200);

    expect(updateRes.body._id).toBe(createdId);
    expect(updateRes.body.status).toBe('Interview');
    expect(updateRes.body.notes).toBe('Phone screen scheduled');
    // unchanged fields preserved
    expect(updateRes.body.company).toBe('Acme Corp');
    expect(updateRes.body.position).toBe('Software Engineer');

    // ── STATS after update ───────────────────────────────────────────────
    stats = await request(app).get('/api/applications/stats').expect(200);
    expect(stats.body).toMatchObject({ total: 1, applied: 0, interview: 1, selected: 0, rejected: 0 });

    // ── DELETE ──────────────────────────────────────────────────────────
    const deleteRes = await request(app)
      .delete(`/api/applications/${createdId}`)
      .expect(200);

    expect(deleteRes.body.message).toBe('Application deleted successfully');

    // ── STATS after delete ───────────────────────────────────────────────
    stats = await request(app).get('/api/applications/stats').expect(200);
    expect(stats.body).toMatchObject({ total: 0, applied: 0, interview: 0, selected: 0, rejected: 0 });

    // ── Confirm record is gone ───────────────────────────────────────────
    await request(app).get(`/api/applications/${createdId}`).expect(404);
  });
});

// ---------------------------------------------------------------------------
// 2. Route priority: GET /stats must NOT be captured by /:id
// ---------------------------------------------------------------------------
describe('Route priority — /stats before /:id', () => {
  it('GET /api/applications/stats returns a stats object (not a 404)', async () => {
    const res = await request(app)
      .get('/api/applications/stats')
      .expect(200);

    // Must have all five numeric keys
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('applied');
    expect(res.body).toHaveProperty('interview');
    expect(res.body).toHaveProperty('selected');
    expect(res.body).toHaveProperty('rejected');

    // Must NOT look like an error response
    expect(res.body.message).toBeUndefined();
  });

  it('stats values are numbers, not a CastError from treating "stats" as an ObjectId', async () => {
    const res = await request(app)
      .get('/api/applications/stats')
      .expect(200);

    expect(typeof res.body.total).toBe('number');
    expect(typeof res.body.applied).toBe('number');
    expect(typeof res.body.interview).toBe('number');
    expect(typeof res.body.selected).toBe('number');
    expect(typeof res.body.rejected).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// 3. Edge cases
// ---------------------------------------------------------------------------
describe('Edge cases', () => {
  it('POST with missing required field (company) returns 400', async () => {
    const { company, ...withoutCompany } = validPayload();
    const res = await request(app)
      .post('/api/applications')
      .send(withoutCompany)
      .expect(400);

    expect(res.body.message).toBeTruthy();
  });

  it('GET /:id with a valid-format but unknown id returns 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/applications/${fakeId}`)
      .expect(404);

    expect(res.body.message).toBe('Application not found');
  });

  it('PUT /:id with an invalid status value returns 400', async () => {
    const createRes = await request(app)
      .post('/api/applications')
      .send(validPayload())
      .expect(201);

    await request(app)
      .put(`/api/applications/${createRes.body._id}`)
      .send({ status: 'NotAValidStatus' })
      .expect(400);
  });

  it('DELETE /:id with a valid-format but unknown id returns 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/applications/${fakeId}`)
      .expect(404);

    expect(res.body.message).toBe('Application not found');
  });
});

// ---------------------------------------------------------------------------
// 4. Property test for full data roundtrip (Task 14.2 / Property 8)
// ---------------------------------------------------------------------------
const fc = require('fast-check');

describe('Property-based testing (Task 14.2)', () => {
  const applicationArbitrary = fc.record({
    company: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0 && !s.includes('\0')),
    position: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0 && !s.includes('\0')),
    status: fc.constantFrom('Applied', 'Interview', 'Selected', 'Rejected'),
    applicationDate: fc
      .integer({ min: 1577836800000, max: 1924905600000 })
      .map((ts) => new Date(ts).toISOString().split('T')[0]),
    jobUrl: fc.constantFrom('', 'https://example.com/job', 'http://company.org/careers'),
    notes: fc.string({ maxLength: 100 }).filter((s) => !s.includes('\0')),
  });

  it('Property 8: GET /:id round-trip for arbitrary valid payloads (100 iterations)', async () => {
    // Feature: careerflow, Property 8: GET /:id round-trip
    await fc.assert(
      fc.asyncProperty(applicationArbitrary, async (payload) => {
        const createRes = await request(app)
          .post('/api/applications')
          .send(payload)
          .expect(201);

        const createdId = createRes.body._id;
        expect(createdId).toBeTruthy();

        const getRes = await request(app)
          .get(`/api/applications/${createdId}`)
          .expect(200);

        expect(getRes.body._id).toBe(createdId);
        expect(getRes.body.company).toBe(payload.company.trim());
        expect(getRes.body.position).toBe(payload.position.trim());
        expect(getRes.body.status).toBe(payload.status);
        expect(getRes.body.jobUrl).toBe(payload.jobUrl.trim());
        expect(getRes.body.notes).toBe(payload.notes.trim());
      }),
      { numRuns: 100 }
    );
  });
});

