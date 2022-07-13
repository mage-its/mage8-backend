const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const workshopController = require('../../controllers/workshop.controller');
const readForm = require('../../middlewares/readForm');

const router = express.Router();

router.route('/').post(readForm('workshop'), workshopController.daftarWorkshop).get(workshopController.getWorkshops);

module.exports = router;
