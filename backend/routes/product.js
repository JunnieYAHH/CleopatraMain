const express = require('express');
const router = express.Router();

const {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createReviewProduct,
    getProductReviews,
    getAdminProducts,
    deleteProductReviews
} = require('../controllers/productController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.route('/products').get(getProducts);
router.route('/admin/products').get(getAdminProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/create').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.route('/review').put(isAuthenticatedUser, createReviewProduct)
router.route('/reviews').get(isAuthenticatedUser, getProductReviews)
router.route('/delete/reviews').delete(isAuthenticatedUser, deleteProductReviews)

module.exports = router;