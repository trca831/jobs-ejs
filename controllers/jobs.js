const Job = require('../models/Job');

exports.list = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id });
  res.render('jobs', { jobs });
};

exports.newForm = (req, res) => {
  res.render('job', { job: null });
};

exports.create = async (req, res) => {
  await Job.create({ ...req.body, createdBy: req.user._id });
  res.redirect('/jobs');
};

exports.editForm = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
  res.render('job', { job });
};

exports.update = async (req, res) => {
  await Job.updateOne(
    { _id: req.params.id, createdBy: req.user._id },
    req.body
  );
  res.redirect('/jobs');
};

exports.delete = async (req, res) => {
  await Job.deleteOne({ _id: req.params.id, createdBy: req.user._id });
  res.redirect('/jobs');
};