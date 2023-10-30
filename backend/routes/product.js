const express = require('express');
const router = express.Router();

const { createProduct, getProducts, getSingleProduct, updateProduct, deleteProduct} = require('../controllers/productController')

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/create').post(createProduct);
router.route('/admin/product/:id').put(updateProduct).delete(deleteProduct);

module.exports = router;