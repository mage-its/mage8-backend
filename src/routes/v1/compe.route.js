const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const readForm = require('../../middlewares/readForm');
const compeValidation = require('../../validations/compe.validation');
const compeController = require('../../controllers/compe.controller');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');

const router = express.Router();

router.post('/pay', auth(), readForm('payment'), validate(compeValidation.pay), compeController.pay, cancelFileUpload());

router.post(
  '/toggle-verif/:userId',
  auth('manageUsers'),
  validate(compeValidation.toggleVerif),
  compeController.toggleVerif
);

module.exports = router;
