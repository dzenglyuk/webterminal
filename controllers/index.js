const express = require('express');
const router = express.Router();

router.use('/terminals', require('./terminal'));
router.use('/ftp', require('./ftp'));
router.use('/ssh', require('./ssh'));

module.exports = router;
