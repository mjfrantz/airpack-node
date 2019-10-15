const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require('validator');

const packSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A pack must have a name"],
      unique: true,
      maxlength: [60, "A pack name must have less or equal to 60 characters"],
      minlength: [5, "A pack must have at least or equal to 5 characters"]
    },
    slug: String,
    description: {
      type: String,
      required: [true, "A pack must have a description"]
    },
    packCoverImage: {
      type: String
      // required: [true, 'A pack must have an cover image']
    },
    items: {
      type: [String],
      required: [true, "A pack must have items"]
    },
    images: {
      type: [String]
      // required: [true, 'Pack items must have images']
    },
    price: {
      type: Number,
      required: [true, "A pack must have a price"]
    },
    type: {
      type: String,
      required: [true, "A pack must have a type"]
      // Need to make this a drop down with different options
    },
    size: {
      type: String,
      required: [true, "A pack must have a size"],
      enum: {
        values: ["small", "medium", "large", "x-large"],
        message: "Size is either: small, medium, large, or x-large"
      }
    },
    days: {
      type: Number,
      required: [true, "A pack must have a number of days"]
      // Figure out lengths of pack 3,5,7?
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Virtual Populate
packSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "pack",
  localField: "_id"
});

//Document Middleware: runs before .save() and .create()
packSchema.pre("save", function(next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});

const Pack = mongoose.model("Pack", packSchema);

module.exports = Pack;
