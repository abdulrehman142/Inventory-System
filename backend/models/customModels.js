const { poolPromise } = require('../config/db');

const getEmployeeDetailsDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwEmployeeDetails');
  return result.recordset;
};

const getOrderSummaryDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwOrderSummary');
    return result.recordset;
};

const getPurchaseOrderSummaryDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwPurchaseOrderSummary');
  return result.recordset;
};

const getCustomerFeedbackDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwCustomerFeedback');
  return result.recordset;
};


module.exports = {
  getEmployeeDetailsDetailsView,
  getOrderSummaryDetailsView,
  getPurchaseOrderSummaryDetailsView,
  getCustomerFeedbackDetailsView,
};
