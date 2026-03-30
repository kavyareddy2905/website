const mongoose = require('mongoose');
const SareeSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stockStatus: String,
  imageUrl: String,
  description: String
});
module.exports = mongoose.model('Saree', SareeSchema);