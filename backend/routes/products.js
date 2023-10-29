const express = require('express');
const router = express.Router();

<<<<<<< HEAD
const { createProduct, getProducts, getSingleProduct, updateProduct} = require('../controllers/productController')

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/products/create').post(createProduct);
router.route('/admin/product/:id').put(updateProduct);
=======
const { createProduct, getProducts, getSingleProduct } = require('../controllers/productController')

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/products/create').post(createProduct);
>>>>>>> ba2e36c5d6bfefa099b57e65c14f601f4d942dce

module.exports = router;