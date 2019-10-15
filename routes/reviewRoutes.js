const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

//Merge allows for in packRoutes
// router
//   .route('/:packId/reviews')*****
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  ); // Only regular users can post reviews

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
