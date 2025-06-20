const request = require('supertest');
const app = require('../app');

// Mock the model so no real DB calls are made
jest.mock('../models/oapModels');
const model = require('../models/oapModels');

describe('OAP API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ------ VIEW endpoints ------
  describe('GET /api/oap/orders', () => {
    it('should return orders list', async () => {
      const sample = [{ order_id: 1, customer_id: 42, order_date: '2025-04-19', order_status: 'Pending', total_amount: 100, discount: 0, tax: 0 }];
      model.getOrdersDetailsView.mockResolvedValue(sample);

      const res = await request(app).get('/api/oap/orders');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(sample);
      expect(model.getOrdersDetailsView).toHaveBeenCalled();
    });

    it('should handle DB errors', async () => {
      model.getOrdersDetailsView.mockRejectedValue(new Error('failure'));
      const res = await request(app).get('/api/oap/orders');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });

  describe('GET /api/oap/orderItems', () => {
    it('should return order items list', async () => {
      const sample = [{ order_item_id: 1, order_id: 1, product_id: 9, quantity: 2, price: 50, discount: 0 }];
      model.getOrderItemsDetailsView.mockResolvedValue(sample);

      const res = await request(app).get('/api/oap/orderItems');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(sample);
      expect(model.getOrderItemsDetailsView).toHaveBeenCalled();
    });
  });

  describe('GET /api/oap/invoices', () => {
    it('should return invoices list', async () => {
      const sample = [{ invoice_id: 1, order_id: 1, invoice_date: '2025-04-20', due_date: '2025-05-20', invoice_status: 'Open' }];
      model.getInvoicesDetailsView.mockResolvedValue(sample);

      const res = await request(app).get('/api/oap/invoices');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(sample);
      expect(model.getInvoicesDetailsView).toHaveBeenCalled();
    });
  });

  describe('GET /api/oap/payments', () => {
    it('should return payments list', async () => {
      const sample = [{ payment_id: 1, invoice_id: 1, payment_date: '2025-04-20', payment_method: 'Card', amount: 100, transaction_id: 'TX123', status: 'Completed' }];
      model.getPaymentsDetailsView.mockResolvedValue(sample);

      const res = await request(app).get('/api/oap/payments');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(sample);
      expect(model.getPaymentsDetailsView).toHaveBeenCalled();
    });
  });

  // ------ CRUD: Orders ------
  describe('POST /api/oap/orders/add', () => {
    it('should add an order', async () => {
      const payload = { customer_id: 42, order_date: '2025-04-19', order_status: 'New', total_amount: 200, discount: 10, tax: 5 };
      model.addOrder.mockResolvedValue(1);

      const res = await request(app).post('/api/oap/orders/add').send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Order added successfully' });
      expect(model.addOrder).toHaveBeenCalledWith(42, '2025-04-19', 'New', 200, 10, 5);
    });
  });

  describe('PUT /api/oap/orders/update', () => {
    it('should update an order', async () => {
      const payload = { order_id: 1, customer_id: 42, order_date: '2025-04-19', order_status: 'Shipped', total_amount: 250, discount: 0, tax: 10 };
      model.updateOrder.mockResolvedValue(1);

      const res = await request(app).put('/api/oap/orders/update').send(payload);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Order updated successfully' });
      expect(model.updateOrder).toHaveBeenCalledWith(1, 42, '2025-04-19', 'Shipped', 250, 0, 10);
    });
  });

  describe('DELETE /api/oap/orders/delete/:order_id', () => {
    it('should delete an order', async () => {
      model.deleteOrder.mockResolvedValue(1);

      const res = await request(app).delete('/api/oap/orders/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Order deleted successfully' });
      expect(model.deleteOrder).toHaveBeenCalledWith('1');
    });
  });

  // ------ CRUD: Order Items ------
  describe('POST /api/oap/order-items/add', () => {
    it('should add an order item', async () => {
      const payload = { order_id: 1, product_id: 9, quantity: 3, price: 30, discount: 0 };
      model.addOrderItem.mockResolvedValue(1);

      const res = await request(app).post('/api/oap/order-items/add').send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Order item added successfully' });
      expect(model.addOrderItem).toHaveBeenCalledWith(1, 9, 3, 30, 0);
    });
  });

  describe('PUT /api/oap/order-items/update', () => {
    it('should update an order item', async () => {
      const payload = { order_item_id: 1, order_id: 1, product_id: 9, quantity: 5, price: 30, discount: 2 };
      model.updateOrderItem.mockResolvedValue(1);

      const res = await request(app).put('/api/oap/order-items/update').send(payload);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Order item updated successfully' });
      expect(model.updateOrderItem).toHaveBeenCalledWith(1, 1, 9, 5, 30, 2);
    });
  });

  describe('DELETE /api/oap/order-items/delete/:order_item_id', () => {
    it('should delete an order item', async () => {
      model.deleteOrderItem.mockResolvedValue(1);

      const res = await request(app).delete('/api/oap/order-items/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Order item deleted successfully' });
      expect(model.deleteOrderItem).toHaveBeenCalledWith('1');
    });
  });

  // ------ CRUD: Invoices ------
  describe('POST /api/oap/invoices/add', () => {
    it('should add an invoice', async () => {
      const payload = { order_id: 1, invoice_date: '2025-04-20', due_date: '2025-05-01', invoice_status: 'Draft' };
      model.addInvoice.mockResolvedValue(1);

      const res = await request(app).post('/api/oap/invoices/add').send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Invoice added successfully' });
      expect(model.addInvoice).toHaveBeenCalledWith(1, '2025-04-20', '2025-05-01', 'Draft');
    });
  });

  describe('PUT /api/oap/invoices/update', () => {
    it('should update an invoice', async () => {
      const payload = { invoice_id: 1, order_id: 1, invoice_date: '2025-04-20', due_date: '2025-05-10', invoice_status: 'Final' };
      model.updateInvoice.mockResolvedValue(1);

      const res = await request(app).put('/api/oap/invoices/update').send(payload);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Invoice updated successfully' });
      expect(model.updateInvoice).toHaveBeenCalledWith(1, 1, '2025-04-20', '2025-05-10', 'Final');
    });
  });

  describe('DELETE /api/oap/invoices/delete/:invoice_id', () => {
    it('should delete an invoice', async () => {
      model.deleteInvoice.mockResolvedValue(1);

      const res = await request(app).delete('/api/oap/invoices/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Invoice deleted successfully' });
      expect(model.deleteInvoice).toHaveBeenCalledWith('1');
    });
  });

  // ------ CRUD: Payments ------
  describe('POST /api/oap/payments/add', () => {
    it('should add a payment', async () => {
      const payload = { invoice_id: 1, payment_date: '2025-04-20', payment_method: 'Card', amount: 150, transaction_id: 'TX999', status: 'Paid' };
      model.addPayment.mockResolvedValue(1);

      const res = await request(app).post('/api/oap/payments/add').send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Payment added successfully' });
      expect(model.addPayment).toHaveBeenCalledWith(1, '2025-04-20', 'Card', 150, 'TX999', 'Paid');
    });
  });

  describe('PUT /api/oap/payments/update', () => {
    it('should update a payment', async () => {
      const payload = { payment_id: 1, invoice_id: 1, payment_date: '2025-04-21', payment_method: 'Cash', amount: 200, transaction_id: null, status: 'Completed' };
      model.updatePayment.mockResolvedValue(1);

      const res = await request(app).put('/api/oap/payments/update').send(payload);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Payment updated successfully' });
      expect(model.updatePayment).toHaveBeenCalledWith(1, 1, '2025-04-21', 'Cash', 200, null, 'Completed');
    });
  });

  describe('DELETE /api/oap/payments/delete/:payment_id', () => {
    it('should delete a payment', async () => {
      model.deletePayment.mockResolvedValue(1);

      const res = await request(app).delete('/api/oap/payments/delete/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Payment deleted successfully' });
      expect(model.deletePayment).toHaveBeenCalledWith('1');
    });
  });
});
