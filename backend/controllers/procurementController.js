const userModel = require('../models/procurementModels');

const getPurchaseOrdersDetails = async (req, res) => {
  try {
    const details = await userModel.getPurchaseOrdersDetailsView();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

const getPurchaseOrderItemsDetails = async (req, res) => {
    try {
      const details = await userModel.getPurchaseOrderItemsDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

// ==================== PURCHASE ORDERS ====================

const addPurchaseOrder = async (req, res) => {
  try {
    const {
      supplier_id,
      order_date = null,
      status = 'Pending',
      total_amount = null,
      expected_delivery_date = null,
    } = req.body;

    await userModel.addPurchaseOrder(supplier_id, order_date, status, total_amount, expected_delivery_date);
    res.status(201).json({ message: 'Purchase order added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePurchaseOrder = async (req, res) => {
  try {
    const {
      po_id,
      supplier_id,
      order_date,
      status,
      total_amount = null,
      expected_delivery_date = null,
    } = req.body;

    await userModel.updatePurchaseOrder(po_id, supplier_id, order_date, status, total_amount, expected_delivery_date);
    res.json({ message: 'Purchase order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePurchaseOrder = async (req, res) => {
  try {
    const { po_id } = req.params;
    await userModel.deletePurchaseOrder(po_id);
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== PURCHASE ORDER ITEMS ====================

const addPurchaseOrderItem = async (req, res) => {
  try {
    const { po_id, product_id, quantity, unit_cost } = req.body;
    await userModel.addPurchaseOrderItem(po_id, product_id, quantity, unit_cost);
    res.status(201).json({ message: 'Purchase order item added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePurchaseOrderItem = async (req, res) => {
  try {
    const { po_item_id, po_id, product_id, quantity, unit_cost } = req.body;
    await userModel.updatePurchaseOrderItem(po_item_id, po_id, product_id, quantity, unit_cost);
    res.json({ message: 'Purchase order item updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePurchaseOrderItem = async (req, res) => {
  try {
    const { po_item_id } = req.params;
    await userModel.deletePurchaseOrderItem(po_item_id);
    res.json({ message: 'Purchase order item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPurchaseOrdersDetails,
  getPurchaseOrderItemsDetails,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  addPurchaseOrderItem,
  updatePurchaseOrderItem,
  deletePurchaseOrderItem,
};
