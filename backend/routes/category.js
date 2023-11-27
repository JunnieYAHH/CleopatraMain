const express = require('express');
const router = express.Router();

const {
    createCategory,
    getAdminCategory,
    updateCategory,
    getSingleCategory,
    deleteCategory
} = require('../controllers/categoryController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/admin/categories').get(getAdminCategory);
router.route('/category/:id').get(isAuthenticatedUser, authorizeRoles('admin'),getSingleCategory);
router.route('/admin/category/create').post(isAuthenticatedUser, authorizeRoles('admin'), createCategory);
router.route('/admin/category/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateCategory)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCategory)

module.exports = router;