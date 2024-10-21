const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  }],
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
