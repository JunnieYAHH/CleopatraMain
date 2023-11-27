const express = require('express');
const router = express.Router();

const {
    createCategory,
    getAdminCategory,
    updateCategory,
    getSingleCategory
} = require('../controllers/categoryController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/admin/categories').get(getAdminCategory);
router.route('/category/:id').get(getSingleCategory);
router.route('/admin/category/create').post(isAuthenticatedUser, authorizeRoles('admin'), createCategory);
router.route('/admin/category/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateCategory)
module.exports = router;