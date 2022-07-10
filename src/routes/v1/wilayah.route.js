const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const wilayahValidation = require('../../validations/wilayah.validation');
const wilayahController = require('../../controllers/wilayah.controller');

const router = express.Router();

router.route('/provinsi').get(wilayahController.getAllProvinces);

router
  .route('/kota-kabupaten')
  .get(validate(wilayahValidation.getCityByProvinceId), wilayahController.getCitiesByProvinceId);

module.exports = router;
