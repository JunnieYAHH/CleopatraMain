const express = require('express');
const router = express.Router();

const { createProduct, getProducts, getSingleProduct } = require('../controllers/productController')

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/products/create').post(createProduct);

module.exports = router;