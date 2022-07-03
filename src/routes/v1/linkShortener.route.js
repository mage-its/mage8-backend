const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const linkShortenerController = require('../../controllers/linkShortener.controller');
const linkShortenerValidation = require('../../validations/linkShortener.validation');

const router = express.Router();

router.post('/', auth('manageLinkShortener'), validate(linkShortenerValidation.createLinkShortener), linkShortenerController.createLinkShortener);
router.get('/', auth('getLinkShortener'), validate(linkShortenerValidation.getLinkShorteners), linkShortenerController.getLinkShorteners);
router.patch('/:id',auth('manageLinkShortener'), validate(linkShortenerValidation.updateLinkShortener), linkShortenerController.updateLinkShortener);
router.delete('/:id', auth('manageLinkShortener'), validate(linkShortenerValidation.deleteLinkShortener), linkShortenerController.deleteLinkShortener);
router.get('/slug/:slug',auth('getLinkShortener'), validate(linkShortenerValidation.getLinkShortenerBySlug), linkShortenerController.getLinkShortenerBySlug);
router.patch('/slug/:slug',auth('manageLinkShortener'), validate(linkShortenerValidation.updateLinkShortenerBySlug), linkShortenerController.updateLinkShortenerBySlug);
router.delete('/slug/:slug',auth('manageLinkShortener'), validate(linkShortenerValidation.deleteLinkShortenerBySlug), linkShortenerController.deleteLinkShortenerBySlug);

module.exports = router;