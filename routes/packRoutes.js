const express = require('express');
const router = express.Router();
const packController = require('./../controllers/packController');

router.route('/').get(packController.getAllPacks).post(packController.createPack);
router.route('/:id').get(packController.getPack).patch(packController.updatePack).delete(packController.deletePack);

module.exports = router;