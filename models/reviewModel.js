//  review / rating / createdAt / ref to Pack / ref to User
const mongoose = require('mongoose');
// const Pack = require('./packModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    // rating: {
    //   type: Number,
    //   min: 1,
    //   max: 5
    // },
    createdAt: {
      type: Date,
      default: Date.now
    },
    pack: {
      type: mongoose.Schema.ObjectId,
      ref: 'Pack',
      required: [true, 'Review must belong to a pack.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Does not allow a user to create another review on the same pack
reviewSchema.index({ pack: 1, user: 1 }, { unique: true });

// Populate
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: "pack",
  //   select: "name"
  // }).populate({
  //   path: "user",
  //   select: "name image"
  // });
  this.populate({
    path: 'user',
    select: 'name image'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
