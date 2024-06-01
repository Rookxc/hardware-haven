const mongoose = require('mongoose');

const processedItemSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const basketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [processedItemSchema]
});

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;