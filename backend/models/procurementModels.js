const { poolPromise } = require('../config/db');

const getPurchaseOrdersDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwPurchaseOrders');
  return result.recordset;
};

const getPurchaseOrderItemsDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwPurchaseOrderItems');
    return result.recordset;
};

// ==================== PURCHASE ORDERS ====================

const addPurchaseOrder = async (supplier_id, order_date = null, status = 'Pending', total_amount = null, expected_delivery_date = null) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('supplier_id', supplier_id)
    .input('order_date', order_date)
    .input('status', status)
    .input('total_amount', total_amount)
    .input('expected_delivery_date', expected_delivery_date)
    .execute('spAddPurchaseOrder');
  return result.rowsAffected;
};

const updatePurchaseOrder = async (po_id, supplier_id, order_date, status, total_amount = null, expected_delivery_date = null) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('po_id', po_id)
    .input('supplier_id', supplier_id)
    .input('order_date', order_date)
    .input('status', status)
    .input('total_amount', total_amount)
    .input('expected_delivery_date', expected_delivery_date)
    .execute('spUpdatePurchaseOrder');
  return result.rowsAffected;
};

const deletePurchaseOrder = async (po_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('po_id', po_id)
    .execute('spDeletePurchaseOrder');
  return result.rowsAffected;
};

// ==================== PURCHASE ORDER ITEMS ====================

const addPurchaseOrderItem = async (po_id, product_id, quantity, unit_cost) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('po_id', po_id)
    .input('product_id', product_id)
    .input('quantity', quantity)
    .input('unit_cost', unit_cost)
    .execute('spAddPurchaseOrderItem');
  return result.rowsAffected;
};

const updatePurchaseOrderItem = async (po_item_id, po_id, product_id, quantity, unit_cost) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('po_item_id', po_item_id)
    .input('po_id', po_id)
    .input('product_id', product_id)
    .input('quantity', quantity)
    .input('unit_cost', unit_cost)
    .execute('spUpdatePurchaseOrderItem');
  return result.rowsAffected;
};

const deletePurchaseOrderItem = async (po_item_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('po_item_id', po_item_id)
    .execute('spDeletePurchaseOrderItem');
  return result.rowsAffected;
};

module.exports = {
  getPurchaseOrdersDetailsView,
  getPurchaseOrderItemsDetailsView,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  addPurchaseOrderItem,
  updatePurchaseOrderItem,
  deletePurchaseOrderItem
};
