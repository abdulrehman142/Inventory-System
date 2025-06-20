const request = require('supertest');
const app = require('../app');

// Mock the model methods to avoid real database calls
jest.mock('../models/customModels', () => ({
  getEmployeeDetailsDetailsView: jest.fn(),
  getOrderSummaryDetailsView: jest.fn(),
  getPurchaseOrderSummaryDetailsView: jest.fn(),
  getCustomerFeedbackDetailsView: jest.fn(),
}));

const {
  getEmployeeDetailsDetailsView,
  getOrderSummaryDetailsView,
  getPurchaseOrderSummaryDetailsView,
  getCustomerFeedbackDetailsView,
} = require('../models/customModels');

describe('Custom API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/custom/empDetails', () => {
    it('should return 200 and employee details', async () => {
      const mockData = [{ id: 1, name: 'Alice' }];
      getEmployeeDetailsDetailsView.mockResolvedValue(mockData);

      const res = await request(app).get('/api/custom/empDetails');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(getEmployeeDetailsDetailsView).toHaveBeenCalledTimes(1);
    });

    it('should return 500 on error', async () => {
      getEmployeeDetailsDetailsView.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/api/custom/empDetails');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });

  describe('GET /api/custom/orderSummary', () => {
    it('should return 200 and order summary', async () => {
      const mockData = [{ orderId: 101, total: 250.0 }];
      getOrderSummaryDetailsView.mockResolvedValue(mockData);

      const res = await request(app).get('/api/custom/orderSummary');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(getOrderSummaryDetailsView).toHaveBeenCalledTimes(1);
    });

    it('should return 500 on error', async () => {
      getOrderSummaryDetailsView.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/api/custom/orderSummary');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });

  describe('GET /api/custom/purchaseOrderSummary', () => {
    it('should return 200 and purchase order summary', async () => {
      const mockData = [{ poId: 201, amount: 500.0 }];
      getPurchaseOrderSummaryDetailsView.mockResolvedValue(mockData);

      const res = await request(app).get('/api/custom/purchaseOrderSummary');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(getPurchaseOrderSummaryDetailsView).toHaveBeenCalledTimes(1);
    });

    it('should return 500 on error', async () => {
      getPurchaseOrderSummaryDetailsView.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/api/custom/purchaseOrderSummary');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });

  describe('GET /api/custom/customerFeedback', () => {
    it('should return 200 and customer feedback', async () => {
      const mockData = [{ feedbackId: 301, comment: 'Great service!' }];
      getCustomerFeedbackDetailsView.mockResolvedValue(mockData);

      const res = await request(app).get('/api/custom/customerFeedback');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(getCustomerFeedbackDetailsView).toHaveBeenCalledTimes(1);
    });

    it('should return 500 on error', async () => {
      getCustomerFeedbackDetailsView.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/api/custom/customerFeedback');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch user details' });
    });
  });
});
