const mongoose = require('mongoose');
const {Schema} = mongoose;

//create schema object for menu items
const paymentSchema = new Schema({
    transactionId: String,
    email: String,
    price: Number,
    quantity: Number,
    status: String,
    itemName: Array,
    cartItems: Array,
    menuItems: Array,
    createdAt: {
        type: Date,
        default: Date.now
    },
    feedback: [
        {
          itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
          rating: Number
        }
    ],
    generalFeedback: String
})

//create model 
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;