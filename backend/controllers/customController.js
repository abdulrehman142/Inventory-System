const userModel = require('../models/customModels');

const getEmployeeDetailsDetails = async (req, res) => {
  try {
    const details = await userModel.getEmployeeDetailsDetailsView();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

const getOrderSummaryDetails = async (req, res) => {
    try {
      const details = await userModel.getOrderSummaryDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getPurchaseOrderSummaryDetails = async (req, res) => {
    try {
      const details = await userModel.getPurchaseOrderSummaryDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getCustomerFeedbackDetails = async (req, res) => {
    try {
      const details = await userModel.getCustomerFeedbackDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

module.exports = {
  getEmployeeDetailsDetails,
  getOrderSummaryDetails,
  getPurchaseOrderSummaryDetails,
  getCustomerFeedbackDetails,
};
