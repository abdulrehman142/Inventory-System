const request = require('supertest');
const app = require('../app');
const procurementModel = require('../models/procurementModels');

// Mock the procurement model methods
jest.mock('../models/procurementModels');

describe('Procurement API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET purchase orders
  describe('GET /api/procurement/purchaseOrder', () => {
    it('should respond with a list of purchase orders', async () => {
      const mockData = [ { po_id: 1, supplier_id: 2, status: 'Pending' } ];
      procurementModel.getPurchaseOrdersDetailsView.mockResolvedValue(mockData);

      const res = await request(app).get('/api/procurement/purchaseOrder');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(procurementModel.getPurchaseOrdersDetailsView).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      procurementModel.getPurchaseOrdersDetailsView.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/procurement/purchaseOrder');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });

  // GET purchase order items
  describe('GET /api/procurement/purchaseOrderItems', () => {
    it('should respond with a list of purchase order items', async () => {
      const mockItems = [ { po_item_id: 10, po_id: 1, product_id: 5, quantity: 3 } ];
      procurementModel.getPurchaseOrderItemsDetailsView.mockResolvedValue(mockItems);

      const res = await request(app).get('/api/procurement/purchaseOrderItems');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockItems);
      expect(procurementModel.getPurchaseOrderItemsDetailsView).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      procurementModel.getPurchaseOrderItemsDetailsView.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/procurement/purchaseOrderItems');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });

  // POST add purchase order
  describe('POST /api/procurement/purchase-orders/add', () => {
    it('should add a purchase order and return 201', async () => {
      procurementModel.addPurchaseOrder.mockResolvedValue(1);

      const newOrder = { supplier_id: 2, order_date: '2025-04-01', status: 'Pending', total_amount: 100.5, expected_delivery_date: '2025-04-10' };
      const res = await request(app)
        .post('/api/procurement/purchase-orders/add')
        .send(newOrder);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Purchase order added successfully' });
      expect(procurementModel.addPurchaseOrder).toHaveBeenCalledWith(
        newOrder.supplier_id,
        newOrder.order_date,
        newOrder.status,
        newOrder.total_amount,
        newOrder.expected_delivery_date
      );
    });
  });

  // PUT update purchase order
  describe('PUT /api/procurement/purchase-orders/update', () => {
    it('should update a purchase order and return 200', async () => {
      procurementModel.updatePurchaseOrder.mockResolvedValue(1);

      const updateData = { po_id: 1, supplier_id: 3, order_date: '2025-04-02', status: 'Approved', total_amount: 200.0, expected_delivery_date: '2025-04-12' };
      const res = await request(app)
        .put('/api/procurement/purchase-orders/update')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Purchase order updated successfully' });
      expect(procurementModel.updatePurchaseOrder).toHaveBeenCalledWith(
        updateData.po_id,
        updateData.supplier_id,
        updateData.order_date,
        updateData.status,
        updateData.total_amount,
        updateData.expected_delivery_date
      );
    });
  });

  // DELETE purchase order
  describe('DELETE /api/procurement/purchase-orders/delete/:po_id', () => {
    it('should delete a purchase order and return 200', async () => {
      procurementModel.deletePurchaseOrder.mockResolvedValue(1);

      const res = await request(app).delete('/api/procurement/purchase-orders/delete/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Purchase order deleted successfully' });
      expect(procurementModel.deletePurchaseOrder).toHaveBeenCalledWith('1');
    });
  });

  // POST add purchase order item
  describe('POST /api/procurement/purchase-order-items/add', () => {
    it('should add a purchase order item and return 201', async () => {
      procurementModel.addPurchaseOrderItem.mockResolvedValue(1);

      const newItem = { po_id: 1, product_id: 5, quantity: 10, unit_cost: 9.99 };
      const res = await request(app)
        .post('/api/procurement/purchase-order-items/add')
        .send(newItem);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Purchase order item added successfully' });
      expect(procurementModel.addPurchaseOrderItem).toHaveBeenCalledWith(
        newItem.po_id,
        newItem.product_id,
        newItem.quantity,
        newItem.unit_cost
      );
    });
  });

  // PUT update purchase order item
  describe('PUT /api/procurement/purchase-order-items/update', () => {
    it('should update a purchase order item and return 200', async () => {
      procurementModel.updatePurchaseOrderItem.mockResolvedValue(1);

      const updateItem = { po_item_id: 10, po_id: 1, product_id: 6, quantity: 15, unit_cost: 8.5 };
      const res = await request(app)
        .put('/api/procurement/purchase-order-items/update')
        .send(updateItem);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Purchase order item updated successfully' });
      expect(procurementModel.updatePurchaseOrderItem).toHaveBeenCalledWith(
        updateItem.po_item_id,
        updateItem.po_id,
        updateItem.product_id,
        updateItem.quantity,
        updateItem.unit_cost
      );
    });
  });

  // DELETE purchase order item
  describe('DELETE /api/procurement/purchase-order-items/delete/:po_item_id', () => {
    it('should delete a purchase order item and return 200', async () => {
      procurementModel.deletePurchaseOrderItem.mockResolvedValue(1);

      const res = await request(app).delete('/api/procurement/purchase-order-items/delete/10');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Purchase order item deleted successfully' });
      expect(procurementModel.deletePurchaseOrderItem).toHaveBeenCalledWith('10');
    });
  });
});
