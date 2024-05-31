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

const purchaseSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchases: [
      {
        items: [processedItemSchema],
        purchaseDate: { type: Date, default: Date.now }
      }
    ]
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;