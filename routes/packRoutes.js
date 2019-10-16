const express = require('express');

const router = express.Router();
const packController = require('./../controllers/packController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

router.use('/:packId/reviews', reviewRouter);

router
  .route('/')
  .get(packController.getAllPacks)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'packer'),
    packController.createPack
  );

router
  .route('/:id')
  .get(packController.getPack)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'packer'),
    packController.updatePack
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'packer'),
    packController.deletePack
  );

// router.route('/pack-stats').get(packController.getPackStats);

module.exports = router;
