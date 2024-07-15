const Favorite = require('../models/Favorites')

// GET ALL FAVORITE ITEMS FOR A USER
const getAllFavorites = async (req, res) => {
    const userEmail = req.query.email;
    try {
        const favorites = await Favorite.find({ email: userEmail });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ADD A NEW FAVORITE ITEM
const addFavorite = async (req, res) => {
    const favoriteItem = req.body;
    try {
        const existingFavorite = await Favorite.findOne({ menuItemId: favoriteItem.menuItemId, email: favoriteItem.email });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Item already in favorites' });
        }

        const result = await Favorite.create(favoriteItem);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// REMOVE A FAVORITE ITEM
const removeFavorite = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedItem = await Favorite.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Favorite item not found' });
        }
        res.status(200).json({ message: 'Favorite item removed successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllFavorites,
    addFavorite,
    removeFavorite
};
