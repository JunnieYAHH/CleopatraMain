const express = require('express');
const router = express.Router();

const { createProduct, getProducts } = require('../controllers/productController')

router.route('/products').get(getProducts);

router.route('/products/create').post(createProduct);

module.exports = router;