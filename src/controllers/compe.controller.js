const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, compeService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const paymentBarrier = require('../middlewares/paymentBarrier');

const pay = catchAsync(async (req, res) => {
  const payment = await paymentBarrier(req.user.registeredComp, req.user.id);
  if (!payment) {
    res.status(httpStatus.FORBIDDEN).send({
      code: httpStatus.FORBIDDEN,
      message: 'Masa Pembayaran Telah Lewat!',
    });
  } else {
    const compe = await compeService.pay(req.user.id, req.body.namaBayar, req.body.pathBuktiBayar);
    res.send(compe);
  }
});

const toggleVerif = catchAsync(async (req, res) => {
  const thisUser = await userService.getUserById(req.user.id);
  const compe = await compeService.toggleVerif(req.params.compeId, thisUser.name);
  res.send(compe);
});

const getCompetitions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isVerified']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await compeService.queryCompetitions(filter, options);
  res.send(result);
});

const getCompetition = catchAsync(async (req, res) => {
  const [compe] = await compeService.getCompeById(req.params.compeId);
  if (!compe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta competition tidak ditemukan');
  }
  res.send(compe);
});

const getCompetitionByUser = catchAsync(async (req, res) => {
  const [compe] = await compeService.getCompeByUserId(req.params.userId);
  if (!compe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta competition tidak ditemukan');
  }
  res.send(compe);
});

const downloadCsv = catchAsync(async (req, res) => {
  const csv = await compeService.downloadCsv(req.params.compe);
  res.header('Content-Type', 'text/csv');
  res.attachment(`${req.query.compe}.csv`);
  res.send(csv);
});

const submitKarya = catchAsync(async (req, res) => {
  const compe = await compeService.submitKarya(req.user, req.body.linkKarya);
  res.send(compe);
});

module.exports = {
  pay,
  toggleVerif,
  getCompetitions,
  getCompetition,
  getCompetitionByUser,
  downloadCsv,
  submitKarya,
};
