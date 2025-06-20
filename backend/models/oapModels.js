const { poolPromise } = require('../config/db');

const getOrdersDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwOrders');
  return result.recordset;
};

const getOrderItemsDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwOrderItems');
    return result.recordset;
};

const getInvoicesDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwInvoices');
  return result.recordset;
};

const getPaymentsDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwPayments');
  return result.recordset;
};

// ---------------------- Orders ----------------------

const addOrder = async (customer_id, order_date, order_status, total_amount, discount = 0, tax = 0) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('customer_id', customer_id)
    .input('order_date', order_date)
    .input('order_status', order_status)
    .input('total_amount', total_amount)
    .input('discount', discount)
    .input('tax', tax)
    .execute('spAddOrder');
  return result.rowsAffected;
};

const updateOrder = async (order_id, customer_id, order_date, order_status, total_amount, discount, tax) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('order_id', order_id)
    .input('customer_id', customer_id)
    .input('order_date', order_date)
    .input('order_status', order_status)
    .input('total_amount', total_amount)
    .input('discount', discount)
    .input('tax', tax)
    .execute('spUpdateOrder');
  return result.rowsAffected;
};

const deleteOrder = async (order_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('order_id', order_id)
    .execute('spDeleteOrder');
  return result.rowsAffected;
};

// ---------------------- Order Items ----------------------

const addOrderItem = async (order_id, product_id, quantity, price, discount = 0) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('order_id', order_id)
    .input('product_id', product_id)
    .input('quantity', quantity)
    .input('price', price)
    .input('discount', discount)
    .execute('spAddOrderItem');
  return result.rowsAffected;
};

const updateOrderItem = async (order_item_id, order_id, product_id, quantity, price, discount = 0) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('order_item_id', order_item_id)
    .input('order_id', order_id)
    .input('product_id', product_id)
    .input('quantity', quantity)
    .input('price', price)
    .input('discount', discount)
    .execute('spUpdateOrderItem');
  return result.rowsAffected;
};

const deleteOrderItem = async (order_item_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('order_item_id', order_item_id)
    .execute('spDeleteOrderItem');
  return result.rowsAffected;
};

// ---------------------- Invoices ----------------------

const addInvoice = async (order_id, invoice_date = null, due_date = null, invoice_status = null) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('order_id', order_id)
    .input('invoice_date', invoice_date)
    .input('due_date', due_date)
    .input('invoice_status', invoice_status)
    .execute('spAddInvoice');
  return result.rowsAffected;
};

const updateInvoice = async (invoice_id, order_id, invoice_date, due_date, invoice_status = null) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('invoice_id', invoice_id)
    .input('order_id', order_id)
    .input('invoice_date', invoice_date)
    .input('due_date', due_date)
    .input('invoice_status', invoice_status)
    .execute('spUpdateInvoice');
  return result.rowsAffected;
};

const deleteInvoice = async (invoice_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('invoice_id', invoice_id)
    .execute('spDeleteInvoice');
  return result.rowsAffected;
};

// ---------------------- Payments ----------------------

const addPayment = async (invoice_id, payment_date = null, payment_method, amount, transaction_id = null, status = null) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('invoice_id', invoice_id)
    .input('payment_date', payment_date)
    .input('payment_method', payment_method)
    .input('amount', amount)
    .input('transaction_id', transaction_id)
    .input('status', status)
    .execute('spAddPayment');
  return result.rowsAffected;
};

const updatePayment = async (payment_id, invoice_id, payment_date, payment_method, amount, transaction_id = null, status = null) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('payment_id', payment_id)
    .input('invoice_id', invoice_id)
    .input('payment_date', payment_date)
    .input('payment_method', payment_method)
    .input('amount', amount)
    .input('transaction_id', transaction_id)
    .input('status', status)
    .execute('spUpdatePayment');
  return result.rowsAffected;
};

const deletePayment = async (payment_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('payment_id', payment_id)
    .execute('spDeletePayment');
  return result.rowsAffected;
};

module.exports = {
  getOrdersDetailsView,
  getOrderItemsDetailsView,
  getInvoicesDetailsView,
  getPaymentsDetailsView,
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
