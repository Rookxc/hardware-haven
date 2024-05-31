var express = require('express');
const Product = require('../models/Product');
var router = express.Router();

// Get all products
router.get('/', async function (req, res, next) {
    try {
      const products = await Product.find();
      if (products.length == 0) {
        res.status(404).json({ message: 'No products found' });
      } else {
        res.status(200).json(products);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// Get product by ID
router.get('/:id', async function (req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products by query
router.get('/search', async function (req, res, next) {
  const { name, minPrice, maxPrice, categories } = req.query;
  let query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' }; // Case-insensitive regex search
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  if (categories) {
    query.category = { $in: categories.split(',') }; // Split categories by comma
  }

  try {
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

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