const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();

const menuController = require('../controllers/menuControllers')

// get all menu items 
router.get('/', menuController.getAllMenuItems )

//POST A NEW MENU ITEM
router.post('/', menuController.postMenuItem )

//DELETE A MENU ITEM
router.delete('/:id', menuController.deleteMenuItem )

//GET SINGLE MENU ITEM
router.get('/:id', menuController.singleMenuItem)

//UPDATE SINGLE MENU ITEM
router.patch('/:id', menuController.updateMenuItem)

//GET COUNT OF MENU ITEMS BY ALL CATEGORY
router.get("/count/all", menuController.getMenuItemCountByAllCategories);


module.exports = router;