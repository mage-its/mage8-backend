const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, appDevService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const proposalBarrier = require('../middlewares/proposalBarrier')

const daftarAppDev = catchAsync(async (req, res) => {
  const { body, user } = req;
  await userService.checkEmailVerification(user.id);
  await userService.isRegistered(user.id);
  const [appDev] = await appDevService.daftarAppDev(body, user);
  res.status(httpStatus.CREATED).send({ appDev });
});

const updateProfile = catchAsync(async (req, res) => {
  const appDev = await appDevService.updateAppDevByUserId(req.user.id, req.body);
  res.send(appDev);
});

const uploadProposal = catchAsync(async (req, res) => {
  proposalBarrier(req.user.registeredComp);
  const appDev = await appDevService.uploadProposal(req.user.id, req.body);
  res.send(appDev);
});

const checkTeamName = catchAsync(async (req, res) => {
  const { namaTim } = req.body;
  const result = await appDevService.checkTeamName(namaTim);
  res.send(result);
});

const createAppDev = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { body } = req;
  await userService.checkEmailVerification(userId);
  await userService.isRegistered(userId);
  const [appDev] = await appDevService.createAppDev(body, userId);
  res.status(httpStatus.CREATED).send({ appDev });
});

const getAppDevs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isVerified']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await appDevService.queryAppDevs(filter, options);
  res.send(result);
});

const getAppDev = catchAsync(async (req, res) => {
  const appDev = await appDevService.getAppDevById(req.params.appDevId);
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta application development tidak ditemukan');
  }
  res.send(appDev);
});

const updateAppDev = catchAsync(async (req, res) => {
  const appDev = await appDevService.updateAppDevById(req.params.appDevId, req.body);
  res.send(appDev);
});

const deleteAppDev = catchAsync(async (req, res) => {
  await appDevService.deleteAppDevById(req.params.appDevId);
  res.status(httpStatus.NO_CONTENT).send();
});

const toggleVerif = catchAsync(async (req, res) => {
  const thisUser = await userService.getUserById(req.user.id);
  const appDev = await appDevService.toggleVerif(req.params.appDevId, thisUser.name);
  res.send(appDev);
});

const incTahap = catchAsync(async (req, res) => {
  const appDev = await appDevService.incTahap(req.params.appDevId);
  res.send(appDev);
});

const decTahap = catchAsync(async (req, res) => {
  const appDev = await appDevService.decTahap(req.params.appDevId);
  res.send(appDev);
});

module.exports = {
  daftarAppDev,
  updateProfile,
  uploadProposal,
  createAppDev,
  getAppDevs,
  getAppDev,
  updateAppDev,
  deleteAppDev,
  toggleVerif,
  incTahap,
  decTahap,
  checkTeamName,
};
