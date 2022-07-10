const Joi = require('joi');

const getCityByProvinceId = {
  query: Joi.object().keys({
    provinceId: Joi.number(),
  }),
};

module.exports = {
  getCityByProvinceId,
};
