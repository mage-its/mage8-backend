const express = require('express');
const webinarController = require('../../controllers/webinar.controller');
const readForm = require('../../middlewares/readForm');

const router = express.Router();

router.route('/').post(readForm('webinar'), webinarController.daftarWebinar).get(webinarController.getWebinars);

module.exports = router;
