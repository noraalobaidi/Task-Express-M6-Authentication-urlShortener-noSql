const express = require('express');

const router = express.Router();
const passport = require('passport');

const { shorten, redirect, deleteUrl, getUrls } = require('./urls.controllers');

router.post(
  '/shorten',
  passport.authenticate('jwt', { session: false }),
  shorten
);
router.get('/:code', redirect);
router.get('/', getUrls);
router.delete(
  '/:code',
  passport.authenticate('jwt', { session: false }),
  deleteUrl
);

module.exports = router;
