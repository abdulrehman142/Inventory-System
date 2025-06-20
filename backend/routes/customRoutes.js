const express = require('express');
const router = express.Router();
const userController = require('../controllers/customController');

router.get('/empDetails', userController.getEmployeeDetailsDetails);    // from view
router.get('/orderSummary', userController.getOrderSummaryDetails);    // from view
router.get('/purchaseOrderSummary', userController.getPurchaseOrderSummaryDetails);    // from view
router.get('/customerFeedback', userController.getCustomerFeedbackDetails);    // from view

module.exports = router;
