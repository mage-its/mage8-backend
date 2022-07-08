const httpStatus = require('http-status');
const { options, object, link } = require('joi');
const { LinkShortener } = require('../models');
const ApiError = require('../utils/ApiError');

const queryLinkShortener = async (filter, options) => {
  //const link = await LinkShortener.paginate(filter, options);
  return await LinkShortener.paginate(filter, options);
};

const getLinkShortenerBySlug = async (slug) => {
  const link = await LinkShortener.findOne({ slug: slug });
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link tidak ditemukan!');
  }
  return link;
};

const updateLinkShortenerBySlug = async (slug, updateBody) => {
  const link = await getLinkShortenerBySlug(slug);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link tidak ditemukan!');
  }
  Object.assign(link, updateBody);
  await link.save();
  return link;
};

const deleteLinkShortenerBySlug = async (slug) => {
  const link = await getLinkShortenerBySlug(slug);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link tidak ditemukan!');
  }
  await link.remove();
  return link;
};

const createLinkShortener = async (linkShortenerBody) => {
  if (LinkShortener.isSlugTaken(linkShortenerBody.slug)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Short Link sudah terpakai!');
  }
  return await LinkShortener.create(linkShortenerBody);
};

const updateLinkShortener = async (id, updateBody) => {
  const link = await LinkShortener.findById(id);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link tidak ditemukan!');
  }
  Object.assign(link, updateBody);
  await link.save();
  return link;
};

const deleteLinkShortener = async (id) => {
  const link = await LinkShortener.findById(id);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link tidak ditemukan!');
  }
  await link.remove();
  return link;
};

const requestHandler = async (thisSlug) => {
  const { link } = await LinkShortener.findOne({ slug: thisSlug });
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return link;
};

module.exports = {
  queryLinkShortener,
  getLinkShortenerBySlug,
  updateLinkShortenerBySlug,
  deleteLinkShortenerBySlug,
  createLinkShortener,
  updateLinkShortener,
  deleteLinkShortener,
  requestHandler,
};
