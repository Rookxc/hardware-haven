const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
});

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['GPU', 'CPU', 'Case', 'Motherboard', 'RAM', 'Storage Device', 'Power Supply'],
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
    image: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      default: 0
    },
    ratings: {
        type: [ratingSchema],
        default: []
    }
});

productSchema.methods.getAverageRating = function() {
  const ratings = this.ratings;
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
  return sum / ratings.length;
};

const Product = mongoose.model('Product', productSchema);
  
module.exports = Product;