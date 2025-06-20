const userModel = require('../models/poaModels');

const getCustomersDetails = async (req, res) => {
  try {
    const details = await userModel.getCustomersDetailsView();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

const getFeedbackDetails = async (req, res) => {
    try {
      const details = await userModel.getFeedbackDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };



  // ------------------------------
// Customers Controllers
// ------------------------------

const addCustomer = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, address, loyalty_points = 0 } = req.body;
    await userModel.addCustomer(first_name, last_name, phone, email, address, loyalty_points);
    res.status(201).json({ message: 'Customer added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { customer_id, first_name, last_name, phone, email, address, loyalty_points = 0 } = req.body;
    await userModel.updateCustomer(customer_id, first_name, last_name, phone, email, address, loyalty_points);
    res.json({ message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    await userModel.deleteCustomer(customer_id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
// Feedback Controllers
// ------------------------------

const addFeedback = async (req, res) => {
  try {
    const { customer_id, product_id, rating, comment, feedback_date = null } = req.body;
    await userModel.addFeedback(customer_id, product_id, rating, comment, feedback_date);
    res.status(201).json({ message: 'Feedback added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const { feedback_id, customer_id, product_id, rating, comment } = req.body;
    await userModel.updateFeedback(feedback_id, customer_id, product_id, rating, comment);
    res.json({ message: 'Feedback updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { feedback_id } = req.params;
    await userModel.deleteFeedback(feedback_id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  getCustomersDetails,
  getFeedbackDetails,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
