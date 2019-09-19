const mongoose = require('mongoose');
const slugify = require('slugify');

const packSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A pack must have a name'],
        unique: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'A pack must have a description']
    },
    packCoverImage: {
        type: String,
        // required: [true, 'A pack must have an image']
    },
    items: {
        type: String,
        required: [true, 'A pack must have items']
    },
    images: {
        type: [String],
        // required: [true, 'Pack items must have images']
    },
    price: {
        type: Number,
        required: [true, 'A pack must have a price']
    },
    type: {
        type: String,
        required: [true, 'A pack must have a type']
        // Need to make this a drop down with different options
    },
    size: {
        type: String,
        required: [true, 'A pack must have a size']
        // Need to make this a drop down with sizing
    },
    length: {
        type: Number,
        required: [true, 'A pack must have a length']
        // Figure out lengths of pack 3,5,7?
    }
});

//Document Middleware: runs before .save() and .create()
packSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});

const Pack = mongoose.model('Pack', packSchema);

module.exports = Pack;