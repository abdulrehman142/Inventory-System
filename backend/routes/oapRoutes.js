const express = require('express');
const router = express.Router();
const userController = require('../controllers/oapController');

router.get('/orders', userController.getOrdersDetails);    // from view
router.get('/orderItems', userController.getOrderItemsDetails);    // from view
router.get('/invoices', userController.getInvoicesDetails);    // from view
router.get('/payments', userController.getPaymentsDetails);    // from view

// ---------------------- Orders ----------------------
router.post('/orders/add', userController.addOrder);
router.put('/orders/update', userController.updateOrder);
router.delete('/orders/delete/:order_id', userController.deleteOrder);

// ---------------------- Order Items ----------------------
router.post('/order-items/add', userController.addOrderItem);
router.put('/order-items/update', userController.updateOrderItem);
router.delete('/order-items/delete/:order_item_id', userController.deleteOrderItem);

// ---------------------- Invoices ----------------------
router.post('/invoices/add', userController.addInvoice);
router.put('/invoices/update', userController.updateInvoice);
router.delete('/invoices/delete/:invoice_id', userController.deleteInvoice);

// ---------------------- Payments ----------------------
router.post('/payments/add', userController.addPayment);
router.put('/payments/update', userController.updatePayment);
router.delete('/payments/delete/:payment_id', userController.deletePayment);

module.exports = router;
