const express = require('express');
const router = express.Router();

//models
const User = require('../models/User')
const Menu = require('../models/Menu')
const Payment = require('../models/Payment')

//middlewares
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')

//GET ALL ORDERS, USERS, PAYMENTS, MENU ITEMS LENGTH
router.get('/', async (req, res) => {
    try {

        const result = await Payment.aggregate([
            // Unwind the menuItems array to get each item individually
            {
                $unwind: '$menuItems'
            },
            // Convert menuItems to ObjectId
            {
                $addFields: {
                    menuItems: { $toObjectId: "$menuItems" }
                }
            },
             // Lookup to join with the menus collection
            {
                $lookup: {
                    from: 'menus',
                    localField: 'menuItems',
                    foreignField: '_id',
                    as: 'menuItemDetails',
                }
            },
            // Unwind the resulting menuItemDetails array to de-nest the document
            {
                $unwind: '$menuItemDetails'
            },
            // Group by category and calculate total quantity and revenue
            {
                $group: {
                    _id: "$menuItemDetails.category",
                    quantity: { $sum: 1 }, // each document represents one menu item
                    revenue: { $sum: "$menuItemDetails.price" }
                }
            },
            // Project the results to match the required format
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    quantity: '$quantity',
                    revenue: '$revenue'
                }
            }
        ])

        res.json(result);

    } catch (error) {
        res.status(500).send('Internal Server Error' + error.message)
    }
})

module.exports = router