const express = require('express');
const router = express.Router();
const userController = require('../controllers/poiController');

router.get('/categories', userController.getCategoriesDetails);    // from view
router.get('/suppliers', userController.getSuppliersDetails);    // from view
router.get('/products', userController.getProductsDetails);    // from view
router.get('/productsuppliers', userController.getProductSuppliersDetails);    // from view
router.get('/inventory', userController.getInventoryDetails);    // from view


// -------------------- Categories --------------------
router.post('/category/add', userController.addCategory);
router.put('/category/update', userController.updateCategory);
router.delete('/category/delete/:category_id', userController.deleteCategory);

// -------------------- Suppliers --------------------
router.post('/supplier/add', userController.addSupplier);
router.put('/supplier/update', userController.updateSupplier);
router.delete('/supplier/delete/:supplier_id', userController.deleteSupplier);

// -------------------- Products --------------------
router.post('/product/add', userController.addProduct);
router.put('/product/update', userController.updateProduct);
router.delete('/product/delete/:product_id', userController.deleteProduct);

// -------------------- Product-Suppliers --------------------
router.post('/product_supplier/add', userController.addProductSupplier);
router.delete('/product_supplier/delete/:product_id/:supplier_id', userController.deleteProductSupplier);

// -------------------- Inventory --------------------
router.post('/inventory/add', userController.addInventory);
router.put('/inventory/update', userController.updateInventory);
router.delete('/inventory/delete/:inventory_id', userController.deleteInventory);

module.exports = router;
