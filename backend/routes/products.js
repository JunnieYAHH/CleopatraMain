const express = require('express');
const router = express.Router();

<<<<<<< HEAD
const { createProduct, 
    getProducts, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct

} = require('../controllers/productController')
=======
const { createProduct, getProducts, getSingleProduct, updateProduct} = require('../controllers/productController')
>>>>>>> 174c8ff911181f644ef49d429a3bf8d6adfe11a0

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/products/create').post(createProduct);
<<<<<<< HEAD

router.route('/admin/product/:id')
              .put(updateProduct)
              .delete(deleteProduct);
=======
router.route('/admin/product/:id').put(updateProduct);
>>>>>>> 174c8ff911181f644ef49d429a3bf8d6adfe11a0

module.exports = router;