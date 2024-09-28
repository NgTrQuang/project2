const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  address: { type: String, default: null  },
  phoneNumber: { type: String, default: null  },
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
