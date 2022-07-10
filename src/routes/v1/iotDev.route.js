const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const iotDevValidation = require('../../validations/iotDev.validation');
const iotDevController = require('../../controllers/iotDev.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const removeEmpty = require('../../middlewares/removeEmpty');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');
const registerBarrier = require('../../middlewares/registerBarrier');
const proposalBarrier = require('../../middlewares/proposalBarrier');

const router = express.Router();

// User route

router.post(
  '/daftar-iotdev',
  registerBarrier('devcom'),
  auth(),
  validate(iotDevValidation.daftarIotDev),
  iotDevController.daftarIotDev
);

router.patch('/update-profile', auth(), validate(iotDevValidation.updateProfile), iotDevController.updateProfile);

router.post('/upload-proposal', proposalBarrier(), auth(), iotDevController.uploadProposal);

router.post('/check-namaTim', auth(), validate(iotDevValidation.checkTeamName), iotDevController.checkTeamName);
// Admin route

router.get('/', auth('getUsers'), validate(iotDevValidation.getIotDevs), iotDevController.getIotDevs);

router.post('/:userId', auth('manageUsers'), validate(iotDevValidation.createIotDev), iotDevController.createIotDev);

router
  .route('/:iotDevId')
  .get(auth('getUsers'), validate(iotDevValidation.getIotDev), iotDevController.getIotDev)
  .patch(auth('manageUsers'), validate(iotDevValidation.updateIotDev), iotDevController.updateIotDev)
  .delete(auth('manageUsers'), validate(iotDevValidation.deleteIotDev), iotDevController.deleteIotDev);

router.post(
  '/toggle-verif/:iotDevId',
  auth('manageUsers'),
  validate(iotDevValidation.toggleVerif),
  iotDevController.toggleVerif
);

router.post('/inc-tahap/:iotDevId', auth('manageUsers'), validate(iotDevValidation.incTahap), iotDevController.incTahap);

router.post('/dec-tahap/:iotDevId', auth('manageUsers'), validate(iotDevValidation.decTahap), iotDevController.decTahap);

module.exports = router;
