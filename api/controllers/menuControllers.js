const Menu = require("../models/Menu");

//GET ALL THE MENU ITEMS
const getAllMenuItems = async(req, res) => {
    try {
        const menus = await Menu.find({}).sort({createdAt: -1});
        res.status(200).json(menus)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//POST A NEW MENU ITEM
const postMenuItem = async(req, res) => {
    const newItem = req.body;
    try {
        const result = await Menu.create(newItem);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

//DELETE A MENU ITEM
const deleteMenuItem = async(req, res) => {
    const menuId = req.params.id;
    try {
        const deletedItem = await Menu.findByIdAndDelete(menuId);
        if(!deletedItem) {
            return res.status(404).json({ message:'Menu not found'});
        }
        res.status(200).json({message: 'Menu Item deleted successfully!'});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

//GET A SINGLE MENU ITEM
const singleMenuItem = async (req, res) => {
    const menuId = req.params.id;
    try {
        const menu = await Menu.findById(menuId);
        res.status(200).json(menu)

    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}


//UPDATE A MENU ITEM
const updateMenuItem = async (req, res) => {
    const menuId = req.params.id;
    const { name, category, price, recipe, image} = req.body

    try {
        const updatedMenu = await Menu.findByIdAndUpdate(menuId,
            {name, category, price, recipe, image},
            {new: true, runValidator: true}
        );
        if(!updatedMenu) {
            res.status(404).json({ message:'Menu not found'});
        }
        res.status(200).json(updatedMenu)
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

//GET TOTAL NUMBER OF MENU ITEMS BY ALL CATEGORIES
const getMenuItemCountByAllCategories = async (req, res) => {
    try {
        const counts = await Menu.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllMenuItems,
    postMenuItem,
    deleteMenuItem,
    singleMenuItem,
    updateMenuItem,
    getMenuItemCountByAllCategories
}