const { poolPromise } = require('../config/db');

const getCustomersDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwCustomers');
  return result.recordset;
};

const getFeedbackDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwFeedback');
    return result.recordset;
};

// ------------------------------
// Customers Table Functions
// ------------------------------

const addCustomer = async (first_name, last_name, phone, email, address, loyalty_points = 0) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('first_name', first_name)
    .input('last_name', last_name)
    .input('phone', phone)
    .input('email', email)
    .input('address', address)
    .input('loyalty_points', loyalty_points)
    .execute('spAddCustomer');
  return result.rowsAffected;
};

const updateCustomer = async (customer_id, first_name, last_name, phone, email, address, loyalty_points = 0) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('customer_id', customer_id)
    .input('first_name', first_name)
    .input('last_name', last_name)
    .input('phone', phone)
    .input('email', email)
    .input('address', address)
    .input('loyalty_points', loyalty_points)
    .execute('spUpdateCustomer');
  return result.rowsAffected;
};

const deleteCustomer = async (customer_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('customer_id', customer_id)
    .execute('spDeleteCustomer');
  return result.rowsAffected;
};

// ------------------------------
// Feedback Table Functions
// ------------------------------

const addFeedback = async (customer_id, product_id, rating, comment, feedback_date = null) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('customer_id', customer_id)
    .input('product_id', product_id)
    .input('rating', rating)
    .input('comment', comment)
    .input('feedback_date', feedback_date)
    .execute('spAddFeedback');
  return result.rowsAffected;
};

const updateFeedback = async (feedback_id, customer_id, product_id, rating, comment) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('feedback_id', feedback_id)
    .input('customer_id', customer_id)
    .input('product_id', product_id)
    .input('rating', rating)
    .input('comment', comment)
    .execute('spUpdateFeedback');
  return result.rowsAffected;
};

const deleteFeedback = async (feedback_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('feedback_id', feedback_id)
    .execute('spDeleteFeedback');
  return result.rowsAffected;
};

module.exports = {
  getCustomersDetailsView,
  getFeedbackDetailsView,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
