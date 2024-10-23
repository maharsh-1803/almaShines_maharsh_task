const router = require('express').Router();
const { createShortUrl, redirectUrl } = require('../controller/url.controller');

router.post('/shorten', createShortUrl);
router.get('/:shortUrl', redirectUrl);

module.exports = router;
