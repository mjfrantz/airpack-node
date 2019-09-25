const express = require('express');
const router = express.Router();
const packController = require('./../controllers/packController');
const authController = require('./../controllers/authController');

router.route('/').get(authController.protect, packController.getAllPacks).post(packController.createPack);
router.route('/:id').get(packController.getPack).patch(packController.updatePack).delete(packController.deletePack);

// router.route('/pack-stats').get(packController.getPackStats);

module.exports = router;