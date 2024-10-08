var express = require('express');
const Product = require('../models/Product');
var router = express.Router();

router.get('/', async function (req, res, next) {
  const { category } = req.query;

  let query = {};
  if (category) {
    query.category = { $regex: category.replace(/\.$/, ''), $options: 'i' };
  }

  try {
    const products = await Product.find(query);

    if (products.length === 0) {
      res.status(404).json({ message: 'No products found' });
    } else {
      const productsWithAvgRatings = products.map(product => {
        return {
          ...product.toObject(),
          averageRating: product.getAverageRating()
        };
      });
      res.status(200).json(productsWithAvgRatings);
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
          // return with average rating
          const averageRating = product.getAverageRating();
          res.status(200).json({ 
              ...product.toObject(), 
              averageRating 
          });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Find all products by query
router.post('/search', async function (req, res, next) {
  const { name, minPrice, maxPrice, categories, sortOrder } = req.body;
  let query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  if (categories && categories.length > 0) {
    query.category = { $in: categories };
  }
  
  let sortOptions = {};
  if (sortOrder === 'asc') {
    sortOptions = { price: 1 }; // Sort by price ascending
  } else if (sortOrder === 'desc') {
    sortOptions = { price: -1 }; // Sort by price descending
  } else if (sortOrder === 'stock-high') {
    sortOptions = { stock: -1 }; // Sort by highest stock number
  } else if (sortOrder === 'stock-low') {
    sortOptions = { stock: 1 }; // Sort by lowest stock number
  }

  try {
    const products = await Product.find(query).sort(sortOptions);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;