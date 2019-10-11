const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  pack: {
    type: mongoose.Schema.ObjectId,
    ref: "Pack",
    required: [true, "Booking must belong to a Pack!"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"]
  },
  price: {
    type: Number,
    require: [true, "Booking must have a price."]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate("user").populate({
    path: "pack",
    select: "name"
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
