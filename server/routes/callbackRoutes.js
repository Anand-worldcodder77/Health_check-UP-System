const express = require('express');
const router = express.Router();
const { createCallback, getAllCallbacks, updateStatus } = require('../controllers/callbackController');

router.post('/add', createCallback);         // User yahan se bhejega
router.get('/all', getAllCallbacks);        // Admin yahan se dekhega
router.put('/update/:id', updateStatus);     // Admin yahan se status badlega

module.exports = router;