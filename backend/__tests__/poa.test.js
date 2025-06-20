const request = require('supertest');
const app = require('../app');
const poaModel = require('../models/poaModels');

jest.mock('../models/poaModels');

describe('POA API Endpoints', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // GET /api/poa/customer
  describe('GET /api/poa/customer', () => {
    it('should return customers details', async () => {
      const mockCustomers = [{ customer_id: 1, first_name: 'John', last_name: 'Doe' }];
      poaModel.getCustomersDetailsView.mockResolvedValue(mockCustomers);

      const res = await request(app).get('/api/poa/customer');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCustomers);
      expect(poaModel.getCustomersDetailsView).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      poaModel.getCustomersDetailsView.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/poa/customer');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });

  // GET /api/poa/feedback
  describe('GET /api/poa/feedback', () => {
    it('should return feedback details', async () => {
      const mockFeedback = [{ feedback_id: 1, rating: 5, comment: 'Great!' }];
      poaModel.getFeedbackDetailsView.mockResolvedValue(mockFeedback);

      const res = await request(app).get('/api/poa/feedback');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockFeedback);
      expect(poaModel.getFeedbackDetailsView).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      poaModel.getFeedbackDetailsView.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/poa/feedback');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });

  // POST /api/poa/customers/add
  describe('POST /api/poa/customers/add', () => {
    it('should add a new customer', async () => {
      poaModel.addCustomer.mockResolvedValue(1);
      const newCustomer = {
        first_name: 'Jane',
        last_name: 'Doe',
        phone: '1234567890',
        email: 'jane@example.com',
        address: '123 Main St',
        loyalty_points: 10
      };

      const res = await request(app)
        .post('/api/poa/customers/add')
        .send(newCustomer);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Customer added successfully' });
      expect(poaModel.addCustomer).toHaveBeenCalledWith(
        newCustomer.first_name,
        newCustomer.last_name,
        newCustomer.phone,
        newCustomer.email,
        newCustomer.address,
        newCustomer.loyalty_points
      );
    });

    it('should handle errors', async () => {
      poaModel.addCustomer.mockRejectedValue(new Error('Add error'));
      const res = await request(app)
        .post('/api/poa/customers/add')
        .send({});

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  // PUT /api/poa/customers/update
  describe('PUT /api/poa/customers/update', () => {
    it('should update an existing customer', async () => {
      poaModel.updateCustomer.mockResolvedValue(1);
      const updatedCustomer = {
        customer_id: 1,
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '0987654321',
        email: 'jane.smith@example.com',
        address: '456 Elm St',
        loyalty_points: 20
      };

      const res = await request(app)
        .put('/api/poa/customers/update')
        .send(updatedCustomer);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Customer updated successfully' });
      expect(poaModel.updateCustomer).toHaveBeenCalledWith(
        updatedCustomer.customer_id,
        updatedCustomer.first_name,
        updatedCustomer.last_name,
        updatedCustomer.phone,
        updatedCustomer.email,
        updatedCustomer.address,
        updatedCustomer.loyalty_points
      );
    });

    it('should handle errors', async () => {
      poaModel.updateCustomer.mockRejectedValue(new Error('Update error'));
      const res = await request(app)
        .put('/api/poa/customers/update')
        .send({});

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  // DELETE /api/poa/customers/delete/:customer_id
  describe('DELETE /api/poa/customers/delete/:customer_id', () => {
    it('should delete a customer', async () => {
      poaModel.deleteCustomer.mockResolvedValue(1);

      const res = await request(app).delete('/api/poa/customers/delete/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Customer deleted successfully' });
      expect(poaModel.deleteCustomer).toHaveBeenCalledWith('1');
    });

    it('should handle errors', async () => {
      poaModel.deleteCustomer.mockRejectedValue(new Error('Delete error'));

      const res = await request(app).delete('/api/poa/customers/delete/1');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  // POST /api/poa/feedback/add
  describe('POST /api/poa/feedback/add', () => {
    it('should add feedback', async () => {
      poaModel.addFeedback.mockResolvedValue(1);
      const newFeedback = {
        customer_id: 1,
        product_id: 2,
        rating: 5,
        comment: 'Excellent!',
        feedback_date: '2025-04-20'
      };

      const res = await request(app)
        .post('/api/poa/feedback/add')
        .send(newFeedback);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Feedback added successfully' });
      expect(poaModel.addFeedback).toHaveBeenCalledWith(
        newFeedback.customer_id,
        newFeedback.product_id,
        newFeedback.rating,
        newFeedback.comment,
        newFeedback.feedback_date
      );
    });

    it('should handle errors', async () => {
      poaModel.addFeedback.mockRejectedValue(new Error('Add feedback error'));
      const res = await request(app)
        .post('/api/poa/feedback/add')
        .send({});

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  // PUT /api/poa/feedback/update
  describe('PUT /api/poa/feedback/update', () => {
    it('should update feedback', async () => {
      poaModel.updateFeedback.mockResolvedValue(1);
      const updatedFeedback = {
        feedback_id: 1,
        customer_id: 1,
        product_id: 2,
        rating: 4,
        comment: 'Good'
      };

      const res = await request(app)
        .put('/api/poa/feedback/update')
        .send(updatedFeedback);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Feedback updated successfully' });
      expect(poaModel.updateFeedback).toHaveBeenCalledWith(
        updatedFeedback.feedback_id,
        updatedFeedback.customer_id,
        updatedFeedback.product_id,
        updatedFeedback.rating,
        updatedFeedback.comment
      );
    });

    it('should handle errors', async () => {
      poaModel.updateFeedback.mockRejectedValue(new Error('Update feedback error'));
      const res = await request(app)
        .put('/api/poa/feedback/update')
        .send({});

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  // DELETE /api/poa/feedback/delete/:feedback_id
  describe('DELETE /api/poa/feedback/delete/:feedback_id', () => {
    it('should delete feedback', async () => {
      poaModel.deleteFeedback.mockResolvedValue(1);

      const res = await request(app).delete('/api/poa/feedback/delete/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Feedback deleted successfully' });
      expect(poaModel.deleteFeedback).toHaveBeenCalledWith('1');
    });

    it('should handle errors', async () => {
      poaModel.deleteFeedback.mockRejectedValue(new Error('Delete feedback error'));

      const res = await request(app).delete('/api/poa/feedback/delete/1');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
});
