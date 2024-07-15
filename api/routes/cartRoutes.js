const express = require('express')
const Carts = require('../models/Carts');
const router = express.Router();

const cartController = require('../controllers/cartControllers')
const verifyToken = require('../middleware/verifyToken')

router.get('/',verifyToken, cartController.getCartByEmail);
router.post('/',verifyToken, cartController.addToCart);
router.delete('/:id',verifyToken, cartController.deleteCart)
router.put('/:id', cartController.updateCart)
router.get('/:id', cartController.getSingleCart)

module.exports = router;