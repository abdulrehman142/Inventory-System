const model = require('../models/oapModels');

const getOrdersDetails = async (req, res) => {
  try {
    const details = await model.getOrdersDetailsView();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

const getOrderItemsDetails = async (req, res) => {
    try {
      const details = await model.getOrderItemsDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getInvoicesDetails = async (req, res) => {
    try {
      const details = await model.getInvoicesDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getPaymentsDetails = async (req, res) => {
    try {
      const details = await model.getPaymentsDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  // ---------------------- Orders ----------------------

const addOrder = async (req, res) => {
  try {
    const { customer_id, order_date, order_status, total_amount, discount = 0, tax = 0 } = req.body;
    await model.addOrder(customer_id, order_date, order_status, total_amount, discount, tax);
    res.status(201).json({ message: 'Order added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { order_id, customer_id, order_date, order_status, total_amount, discount, tax } = req.body;
    await model.updateOrder(order_id, customer_id, order_date, order_status, total_amount, discount, tax);
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    await model.deleteOrder(order_id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- Order Items ----------------------

const addOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, price, discount = 0 } = req.body;
    await model.addOrderItem(order_id, product_id, quantity, price, discount);
    res.status(201).json({ message: 'Order item added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderItem = async (req, res) => {
  try {
    const { order_item_id, order_id, product_id, quantity, price, discount = 0 } = req.body;
    await model.updateOrderItem(order_item_id, order_id, product_id, quantity, price, discount);
    res.json({ message: 'Order item updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrderItem = async (req, res) => {
  try {
    const { order_item_id } = req.params;
    await model.deleteOrderItem(order_item_id);
    res.json({ message: 'Order item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- Invoices ----------------------

const addInvoice = async (req, res) => {
  try {
    const { order_id, invoice_date = null, due_date = null, invoice_status = null } = req.body;
    await model.addInvoice(order_id, invoice_date, due_date, invoice_status);
    res.status(201).json({ message: 'Invoice added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { invoice_id, order_id, invoice_date, due_date, invoice_status = null } = req.body;
    await model.updateInvoice(invoice_id, order_id, invoice_date, due_date, invoice_status);
    res.json({ message: 'Invoice updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { invoice_id } = req.params;
    await model.deleteInvoice(invoice_id);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- Payments ----------------------

const addPayment = async (req, res) => {
  try {
    const { invoice_id, payment_date = null, payment_method, amount, transaction_id = null, status = null } = req.body;
    await model.addPayment(invoice_id, payment_date, payment_method, amount, transaction_id, status);
    res.status(201).json({ message: 'Payment added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { payment_id, invoice_id, payment_date, payment_method, amount, transaction_id = null, status = null } = req.body;
    await model.updatePayment(payment_id, invoice_id, payment_date, payment_method, amount, transaction_id, status);
    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    await model.deletePayment(payment_id);
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOrdersDetails,
  getOrderItemsDetails,
  getInvoicesDetails,
  getPaymentsDetails,
  addOrder,
  updateOrder,
  deleteOrder,
  addOrderItem,
  updateOrderItem,
  deleteOrderItem,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  addPayment,
  updatePayment,
  deletePayment
};
