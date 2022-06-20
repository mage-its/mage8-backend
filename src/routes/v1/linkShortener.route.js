const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const linkShortenerController = require('../../controllers/linkShortener.controller');

const router = express.Router();

router.post('/', auth('manageLinkShortener'), linkShortenerController.createLinkShortener);
router.get('/', auth('getLinkShortener'), linkShortenerController.getLinkShorteners);
router.patch('/:id',auth('manageLinkShortener'), linkShortenerController.updateLinkShortener);
router.delete('/:id', auth('manageLinkShortener'), linkShortenerController.deleteLinkShortener);
router.get('/slug/:slug',auth('getLinkShortener'), linkShortenerController.getLinkShortenerBySlug);
router.patch('/slug/:slug',auth('manageLinkShortener'), linkShortenerController.updateLinkShortenerBySlug);
router.delete('/slug/:slug',auth('manageLinkShortener'), linkShortenerController.deleteLinkShortenerBySlug);

module.exports = router;