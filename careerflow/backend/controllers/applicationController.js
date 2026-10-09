const Application = require('../models/Application');

const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({});
    res.status(200).json(applications);
  } catch (err) {
    next(err);
  }
};

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
