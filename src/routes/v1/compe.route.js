const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const compeValidation = require('../../validations/compe.validation');
const compeController = require('../../controllers/compe.controller');
const paymentBarrier = require('../../middlewares/paymentBarrier');
const submitKaryaBarrier = require('../../middlewares/submitKaryaBarrier');

const router = express.Router();

router.get('/', auth('getUsers'), compeController.getCompetitions);

router.get('/:compeId', auth('getUsers'), validate(compeValidation.getCompetition), compeController.getCompetition);

router.get(
  '/user/:userId',
  auth('getUsers'),
  validate(compeValidation.getCompetitionByUser),
  compeController.getCompetitionByUser
);

router.post('/pay', auth(), paymentBarrier(), validate(compeValidation.pay), compeController.pay);

router.post(
  '/toggle-verif/:compeId',
  auth('manageUsers'),
  validate(compeValidation.toggleVerif),
  compeController.toggleVerif
);

router.get('/download-csv/:compe', auth('getUsers'), validate(compeValidation.downloadCsv), compeController.downloadCsv);

router.post(
  '/submit-karya',
  submitKaryaBarrier("adevm"),
  auth(),
  validate(compeValidation.submitKarya),
  compeController.submitKarya
);

module.exports = router;
