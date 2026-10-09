const Application = require('../models/Application');

/**
 * GET /api/applications
 * Returns all applications as a JSON array.
 * Requirements: 2.2, 9.5
 */
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({});
    res.status(200).json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/stats
 * Returns aggregate counts by status.
 * Requirements: 8.2, 9.5
 */
const getStats = async (req, res, next) => {
  try {
    const [total, applied, interview, selected, rejected] = await Promise.all([
      Application.countDocuments({}),
      Application.countDocuments({ status: 'Applied' }),
      Application.countDocuments({ status: 'Interview' }),
      Application.countDocuments({ status: 'Selected' }),
      Application.countDocuments({ status: 'Rejected' }),
    ]);

    res.status(200).json({ total, applied, interview, selected, rejected });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/:id
 * Returns a single application by ID.
 * Requirements: 3.2, 3.3, 9.5
 */
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (application === null) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json(application);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Application not found' });
    }
    next(err);
  }
};

/**
 * POST /api/applications
 * Creates a new application from req.body and persists it.
 * Requirements: 1.1, 1.5, 9.5
 */
const createApplication = async (req, res, next) => {
  try {
    const application = new Application(req.body);
    const saved = await application.save();
    return res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

/**
 * PUT /api/applications/:id
 * Updates an existing application by ID.
 * Requirements: 4.2, 4.4, 9.5
 */
const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Application.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updated === null) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Application not found' });
    }
    next(err);
  }
};

/**
 * DELETE /api/applications/:id
 * Permanently removes an application by ID.
 * Requirements: 5.2, 5.3, 9.5
 */
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Application.findByIdAndDelete(id);
    if (deleted === null) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Application not found' });
    }
    next(err);
  }
};

module.exports = { getAllApplications, getStats, getApplicationById, createApplication, updateApplication, deleteApplication };
