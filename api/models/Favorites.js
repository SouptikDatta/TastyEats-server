const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create schema object for favorite items
const favoriteSchema = new Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: String,
    price: Number,
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create model
const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
