const axios = require('axios');
const config = require('../config/config');

const headers = {
  key: config.rajaOngkirKey,
};

const getAllProvinces = async () => {
  const response = await axios.get('https://api.rajaongkir.com/starter/province', { headers });
  return response.data.rajaongkir.results;
};

const getCitiesByProvinceId = async (provinceId) => {
  const response = await axios.get(`https://api.rajaongkir.com/starter/city?province=${provinceId}`, { headers });
  return response.data.rajaongkir.results;
};

module.exports = {
  getAllProvinces,
  getCitiesByProvinceId,
};
