var express = require('express');
const Purchase = require('../models/Purchase');
const Basket = require('../models/Basket');
var router = express.Router();

// Create a purchase from the basket
router.post('/', async (req, res) => {
    const userId = req.userId;

    try {
        // Find user's basket
        const basket = await Basket.findOne({ userId });

        if (!basket || basket.items.length === 0) {
            return res.status(400).json({ message: 'Basket is empty' });
        }

        // Calculate total price
        const totalPrice = basket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Find the user's purchase history
        let purchaseHist = await Purchase.findOne({ userId });

        // If no purchase history exists, create a new one
        if (!purchaseHist) {
            purchaseHist = new Purchase({ userId, purchaseHistory: [] });
        }

        // Add new purchase to the purchaseHistory array
        purchaseHist.purchaseHistory.push({
            items: basket.items,
            purchaseDate: new Date()
        });

        await purchaseHist.save();

        // Clear the basket
        basket.items = [];
        await basket.save();

        res.status(201).json({ message: 'Purchase successfully processed', totalPrice });
    } catch (error) {
        console.error('Error processing purchase', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all purchases for the logged-in user
router.get('/', async (req, res) => {
    const userId = req.userId;

    try {
        const userPurchases = await Purchase.findOne({ userId });

        if (!userPurchases) {
            return res.status(404).json({ message: 'No purchases found' });
        }

        // Sort descending by date
        const sortedPurchases = userPurchases.purchaseHistory.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

        res.status(200).json(sortedPurchases);
    } catch (error) {
        console.error('Error fetching purchases', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;