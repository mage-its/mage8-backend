const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { wilayahService } = require('../services');
const pick = require('../utils/pick');

const getAllProvinces = catchAsync(async (req, res) => {
  const provinces = await wilayahService.getAllProvinces();
  res.send(provinces);
});

const getCitiesByProvinceId = catchAsync(async (req, res) => {
  const options = pick(req.query, ['provinceId']);
  const cities = await wilayahService.getCitiesByProvinceId(options.provinceId);
  res.send(cities);
});

module.exports = {
  getAllProvinces,
  getCitiesByProvinceId,
};
