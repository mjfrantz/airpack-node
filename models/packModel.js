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
    packItems: {
        type: String,
        required: [true, 'A pack must have items']
    },
    ItemImages: {
        type: [String],
        // required: [true, 'Pack items must have images']
    },
    price: {
        type: Number,
        required: [true, 'A pack must have a price']
    }
});

const Pack = mongoose.model('Pack', packSchema);

module.exports = Pack;