const express = require('express');
const router = express.Router();
const Basket = require('../models/Basket');
const Product = require('../models/Product');

// Get basket for a user
router.get('/', async (req, res) => {
  const userId = req.userId;

  try {
    const basket = await Basket.findOne({ userId: userId });
    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }
    res.status(200).json(basket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to basket
router.post('/', async (req, res) => {
  const userId = req.userId;
  const { productId, name, description, price, category, quantity } = req.body;

  try {
    let basket = await Basket.findOne({ userId });

    if (!basket) {
      basket = new Basket({ userId, items: [] });
    }

    const itemIndex = basket.items.findIndex(item => item.productId == productId);

    if (itemIndex > -1) {
      basket.items[itemIndex].quantity += quantity;
    } else {
      basket.items.push({ productId, name, description, price, category, quantity });
    }

    await basket.save();
    res.status(200).json(basket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from basket
router.delete('/:itemId', async (req, res) => {
  const userId = req.userId;
  const { itemId } = req.params;

  try {
    const basket = await Basket.findOne({ userId });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    basket.items = basket.items.filter(item => item._id != itemId);
    await basket.save();

    res.status(200).json(basket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update basket based on sessionStorage
router.put('/sync', async (req, res) => {
  const userId = req.userId;
  const basketItems = JSON.parse(req.body.basketItems); // Assuming basket items are stored in sessionStorage as JSON

  try {
    let basket = await Basket.findOne({ userId });

    if (!basket) {
      basket = new Basket({ userId, items: [] });
    }

    // Update quantity of items in the basket
    basketItems.forEach(async item => {
      const existingItemIndex = basket.items.findIndex(basketItem => basketItem.productId === item.productId);

      if (existingItemIndex > -1) {
        // If the item already exists in the basket, update the quantity
        basket.items[existingItemIndex].quantity = item.quantity;
      } else {
        // If the item doesn't exist in the basket, add it
        // Check if the product exists and has sufficient stock
        const product = await Product.findById(item.productId);
        if (product && product.stock >= item.quantity) {
          basket.items.push(item);
        }
      }
    });

    await basket.save();
    res.status(200).json(basket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
