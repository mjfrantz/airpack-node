const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.packId) filter = { pack: req.params.packId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

//Middleware for exports.createReview
exports.setPackUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.pack) req.body.pack = req.params.packId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
