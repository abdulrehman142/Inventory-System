const express = require('express');
const router = express.Router();
const userController = require('../controllers/procurementController');

router.get('/purchaseOrder', userController.getPurchaseOrdersDetails);    // from view
router.get('/purchaseOrderItems', userController.getPurchaseOrderItemsDetails);    // from view

// ==================== PURCHASE ORDERS ====================

router.post('/purchase-orders/add', userController.addPurchaseOrder);
router.put('/purchase-orders/update', userController.updatePurchaseOrder);
router.delete('/purchase-orders/delete/:po_id', userController.deletePurchaseOrder);

// ==================== PURCHASE ORDER ITEMS ====================

router.post('/purchase-order-items/add', userController.addPurchaseOrderItem);
router.put('/purchase-order-items/update', userController.updatePurchaseOrderItem);
router.delete('/purchase-order-items/delete/:po_item_id', userController.deletePurchaseOrderItem);


module.exports = router;
