const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Cart = require('../models/Carts')
const Menu = require('../models/Menu')
const Payment = require("../models/Payment");
const ObjectId = mongoose.Types.ObjectId;


//Verify Token
const verifyToken = require('../middleware/verifyToken');

//POST Payment Info to DB
router.post('/', verifyToken, async (req, res) => {
    const payment =  req.body;
    try {
        const paymentRequest = await Payment.create(payment)

        //Delete Cart Items after payment successful
        const cartIds = payment.cartItems.map(id => new ObjectId(id))
        const deleteCartRequest = await Cart.deleteMany({_id: {$in: cartIds}})

        res.status(200).json({paymentRequest, deleteCartRequest});

    } catch (error) {
        res.status(404).json({message: error.message});
    }
} )

//GET ORDER INFORMATIONS
router.get('/', verifyToken, async (req, res) => {
    const email = req.query.email;
    const query = {email: email}
    try {
        const decoderEmail = req.decoded.email;
        if(email !== decoderEmail){
            res.status(403).json({message: 'Forbidden Access'});
        }
        const result = await Payment.find(query).sort({createdAt:-1}).exec()
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
})


//GET ALL PAYMENT DETAILS
router.get('/all', async (req, res) => {
    try {
        const payments = await Payment.find({}).sort({createdAt:-1}).exec()
        res.status(200).json(payments)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
})


//Confirm Payment Status
router.patch('/:id', async (req, res) => {
    const payId = req.params.id;
    const {status} = req.body;
    try {
        const updatedStatus = await Payment.findByIdAndUpdate(payId, {status: 'Confirmed'},
            {new: true, runValidators: true}
        )

        if(!updatedStatus){
            return res.status(404).json({message: 'Payment not found!'})
        }
        res.status(200).json(updatedStatus)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
})


// POST Submit ratings and feedback
router.post('/submit-feedback', async (req, res) => {
    const { orderId, ratings, generalFeedback } = req.body;

    try {

        // Check if feedback already exists for this orderId
        const existingPayment = await Payment.findById(orderId);
        if (existingPayment.feedback && existingPayment.feedback.length > 0) {
            return res.status(400).send({ error: 'Feedback already submitted for this order' });
        }
        
        const feedbackArray = Object.keys(ratings).map(itemId => ({
            itemId: new ObjectId(itemId),
            rating: ratings[itemId]
        }));

        // Update Payment with feedback
        await Payment.findByIdAndUpdate(orderId, {
            feedback: feedbackArray,
            generalFeedback
        });

        // Update Menu with overall ratings
        for (const itemId in ratings) {
            const menuItemId = new ObjectId(itemId);
            const rating = parseInt(ratings[itemId], 10); // Ensure rating is parsed to number

            // Find the menu item by ID
            const menuItem = await Menu.findById(menuItemId);

            if (menuItem) {
                // Calculate new average rating
                const currentTotalRating = menuItem.averageRating * menuItem.numberOfRatings;
                const newTotalRating = currentTotalRating + rating;
                const newNumberOfRatings = menuItem.numberOfRatings + 1;
                const newAverageRating = newTotalRating / newNumberOfRatings;

                // Update the Menu item
                await Menu.findByIdAndUpdate(menuItemId, {
                    averageRating: newAverageRating,
                    numberOfRatings: newNumberOfRatings
                });
            } else {
                console.warn(`Menu item with ID ${itemId} not found.`);
            }
        }

        res.status(200).send({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Failed to submit feedback' });
    }
});



module.exports = router;