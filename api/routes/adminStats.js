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
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.countDocuments()
        const menuItems = await Menu.countDocuments()
        const orders = await Payment.countDocuments()

        const result = await Payment.aggregate([{
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: '$price'
                }
            }
        }])

        const revenue = result.length > 0 ? result[0].totalRevenue : 0

        res.status(200).json({
            users,
            menuItems,
            orders,
            revenue
        })

    } catch (error) {
        res.status(500).send('Internal Server Error' + error.message)
    }
})

module.exports = router