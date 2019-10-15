const express = require('express');

const router = express.Router();
const packController = require('./../controllers/packController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

router
  .route('/')
  .get(packController.getAllPacks)
  .post(packController.createPack);

router
  .route('/:id')
  .get(packController.getPack)
  .patch(packController.updatePack)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'packer'),
    packController.deletePack
  );

router
  .route('/:packId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

// router.route('/pack-stats').get(packController.getPackStats);

module.exports = router;
