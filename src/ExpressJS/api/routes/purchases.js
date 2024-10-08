var express = require('express');
const Purchase = require('../models/Purchase');
const Basket = require('../models/Basket');
const Product = require('../models/Product');
const mongoose = require('mongoose');
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
  
      // Begin a session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();
  
      try {
        // Update stock quantities
        for (const basketItem of basket.items) {
          const product = await Product.findById(basketItem.productId).session(session);
          if (product) {
            if (product.stock < basketItem.quantity) {
              throw new Error(`Not enough stock for product ${product.name}`);
            }
            product.stock -= basketItem.quantity;
            await product.save({ session });
          } else {
            throw new Error(`Product with ID ${basketItem.productId} not found.`);
          }
        }
  
        // Calculate total price
        const totalPrice = basket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
        // Find the user's purchase history
        let purchaseHist = await Purchase.findOne({ userId }).session(session);
  
        // If no purchase history exists, create a new one
        if (!purchaseHist) {
          purchaseHist = new Purchase({ userId, purchaseHistory: [] });
        }
  
        // Add new purchase to the purchaseHistory array
        purchaseHist.purchaseHistory.push({
          items: basket.items,
          purchaseDate: new Date(),
          totalPrice, // Include the total price in the purchase history
        });
  
        await purchaseHist.save({ session });
  
        // Clear the basket
        basket.items = [];
        await basket.save({ session });
  
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
  
        res.status(201).json({ message: 'Purchase successfully processed', totalPrice });
      } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
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