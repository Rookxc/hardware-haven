var express = require('express');
const Product = require('../models/Product');
var router = express.Router();

// Add new product
router.post('/', async function (req, res, next) {
    const { name, category, description, price, image, brand, stock, ratings } = req.body;
    try {
      const newProduct = new Product({
        name,
        category,
        description,
        price,
        image,
        brand,
        stock,
        ratings
      });
  
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});
  
// Update product
router.put('/:id', async function (req, res, next) {
    const { name, category, description, price, image, brand, stock, ratings } = req.body;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, category, description, price, image, brand, manufacturer, model, stock, ratings, reviews },
        { new: true }  // This option returns the updated document
      );
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// Update ratings
router.put('/ratings/:itemId', async function (req, res, next) {
  const userId = req.userId;
  const { itemId } = req.params;
  const { rating } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(itemId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already rated the product
    const existingRatingIndex = product.ratings.findIndex(r => r.userId.toString() === userId);

    if (existingRatingIndex >= 0) {
      // Update existing rating
      product.ratings[existingRatingIndex].value = rating;
    } else {
      // Add new rating
      product.ratings.push({ userId, value: rating });
    }

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', async function (req, res, next) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (deletedProduct) {
        res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;