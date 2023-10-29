const express = require('express');
const router = express.Router();

const { createProduct, getProducts, getSingleProduct, updateProduct} = require('../controllers/productController')

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/products/create').post(createProduct);
router.route('/admin/product/:id').put(updateProduct);

module.exports = router;