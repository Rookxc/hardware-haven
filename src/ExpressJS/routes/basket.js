const express = require('express');
const router = express.Router();
const Basket = require('../models/Basket');

// Get basket for a user
router.get('/:userId', async (req, res) => {
  try {
    const basket = await Basket.findOne({ userId: req.params.userId });
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
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
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
router.delete('/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;

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

module.exports = router;
