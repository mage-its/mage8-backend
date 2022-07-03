const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getLinkShorteners = {
    query: Joi.object().keys({
      createdBy: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  };

const getLinkShortenerBySlug = {
    params: Joi.object().keys({
      slug: Joi.string(),
    }),
};

const updateLinkShortenerBySlug ={
    params: Joi.object().keys({
        slug: Joi.string(),
    }),
    body: Joi.object().keys({
        slug: Joi.string(),
        link: Joi.string(),
    }),
};

const deleteLinkShortenerBySlug = {
    params: Joi.object().keys({
        slug: Joi.string(),
    }),
};

const createLinkShortener = {
    body: Joi.object().keys({
        slug: Joi.string().required(),
        link: Joi.string().required(),
        createdBy: Joi.string()
    }),
};

const updateLinkShortener ={
    params: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        slug: Joi.string(),
        link: Joi.string(),
    }),
};

const deleteLinkShortener = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
};

module.exports = {
    getLinkShorteners,
    getLinkShortenerBySlug,
    updateLinkShortenerBySlug,
    deleteLinkShortenerBySlug,
    createLinkShortener,
    updateLinkShortener,
    deleteLinkShortener
};
  