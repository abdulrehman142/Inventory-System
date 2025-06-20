const express = require('express');
const router = express.Router();
const userController = require('../controllers/poaController');

router.get('/customer', userController.getCustomersDetails);    // from view
router.get('/feedback', userController.getFeedbackDetails);    // from view

// ------------------------------
// Customers Routes
// ------------------------------
router.post('/customers/add', userController.addCustomer);
router.put('/customers/update', userController.updateCustomer);
router.delete('/customers/delete/:customer_id', userController.deleteCustomer);

// ------------------------------
// Feedback Routes
// ------------------------------
router.post('/feedback/add', userController.addFeedback);
router.put('/feedback/update', userController.updateFeedback);
router.delete('/feedback/delete/:feedback_id', userController.deleteFeedback);

module.exports = router;
