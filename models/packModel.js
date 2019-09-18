const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A pack must have a name'],
        unique: true
    },
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

const Pack = mongoose.model('Pack', packSchema);

module.exports = Pack;