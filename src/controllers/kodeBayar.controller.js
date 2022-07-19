const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { kodeBayarService } = require('../services');

const createKodeBayar = catchAsync(async (req, res) => {
  const kodeBayar = await kodeBayarService.createKodeBayar(req.body);
  res.status(httpStatus.CREATED).send(kodeBayar);
});

const getKodeBayars = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'price']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await kodeBayarService.queryKodeBayars(filter, options);
  res.send(result);
});

const toggleClose = catchAsync(async (req, res) => {
  const kodeBayar = await kodeBayarService.toggleClose(req.params.id);
  res.send(kodeBayar);
});

const togglePayment = catchAsync(async (req, res) => {
  const kodeBayar = await kodeBayarService.togglePayment(req.params.id);
  res.send(kodeBayar);
});
const toggleProposal = catchAsync(async (req, res) => {
  const kodeBayar = await kodeBayarService.toggleProposal(req.params.id);
  res.send(kodeBayar);
});
const toggleKarya = catchAsync(async (req, res) => {
  const kodeBayar = await kodeBayarService.toggleKarya(req.params.id);
  res.send(kodeBayar);
});

module.exports = {
  createKodeBayar,
  getKodeBayars,
  toggleClose,
  toggleKarya,
  togglePayment,
  toggleProposal,
};
