const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, linkShortenerService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const getLinkShorteners = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['createdBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const link = await linkShortenerService.queryLinkShortener(filter, options);
  res.send(link);
});

const getLinkShortenerBySlug = catchAsync(async (req, res) => {
  const link = await linkShortenerService.getLinkShortenerBySlug(req.params.slug);
  res.send(link);
});

const updateLinkShortenerBySlug = catchAsync(async (req, res) => {
  const link = await linkShortenerService.updateLinkShortenerBySlug(req.params.slug, req.body);
  res.send(link);
});

const deleteLinkShortenerBySlug = catchAsync(async (req, res) => {
  const link = await linkShortenerService.deleteLinkShortenerBySlug(req.params.slug);
  res.status(httpStatus.NO_CONTENT).send();
});

const createLinkShortener = catchAsync(async (req, res) => {
  const { name } = await userService.getUserById(req.user.id);
  req.body.createdBy = name;
  const createdLink = await linkShortenerService.createLinkShortener(req.body);
  res.status(httpStatus.CREATED).send(createdLink);
});

const updateLinkShortener = catchAsync(async (req, res) => {
  const link = await linkShortenerService.updateLinkShortener(req.params.id, req.body);
  res.send(link);
});

const deleteLinkShortener = catchAsync(async (req, res) => {
  const link = await linkShortenerService.deleteLinkShortener(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const requestHandler = catchAsync(async (req, res) => {
  const link = await linkShortenerService.requestHandler(req.params.slug);
  res.redirect(link);
});

module.exports = {
  createLinkShortener,
  getLinkShorteners,
  getLinkShortenerBySlug,
  updateLinkShortenerBySlug,
  deleteLinkShortenerBySlug,
  updateLinkShortener,
  deleteLinkShortener,
  requestHandler,
};
