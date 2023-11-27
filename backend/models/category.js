const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter category name'],
    trim: true,
    maxLength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter category description']
  },
  images: [
    {
       public_id: {
          type: String,
          required: true
       },
       url: {
          type: String,
          required: true
       },
    }
 ],
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
