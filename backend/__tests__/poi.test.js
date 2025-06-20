// __tests__/poi.test.js

const request = require('supertest');
const app = require('../app');
const poiModel = require('../models/poiModels');

// Mock the entire poiModels module
jest.mock('../models/poiModels');

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

describe('POI API', () => {
  //
  //------ READ (GET) ENDPOINTS ------
  //
  describe('GET /api/poi/categories', () => {
    it('should return 200 + array of categories on success', async () => {
      const dummy = [{ category_id: 1, category_name: 'Foo' }];
      poiModel.getCategoriesDetailsView.mockResolvedValue(dummy);

      const res = await request(app).get('/api/poi/categories');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(dummy);
    });

    it('should return 500 on model error', async () => {
      poiModel.getCategoriesDetailsView.mockRejectedValue(new Error('fail'));
      const res = await request(app).get('/api/poi/categories');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/poi/suppliers', () => {
    it('200 + suppliers', async () => {
      const dummy = [{ supplier_id: 2, supplier_name: 'Bar' }];
      poiModel.getSuppliersDetailsView.mockResolvedValue(dummy);

      const res = await request(app).get('/api/poi/suppliers');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(dummy);
    });

    it('500 on error', async () => {
      poiModel.getSuppliersDetailsView.mockRejectedValue(new Error());
      const res = await request(app).get('/api/poi/suppliers');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/poi/products', () => {
    it('200 + products', async () => {
      const dummy = [{ product_id: 3, product_name: 'Baz' }];
      poiModel.getProductsDetailsView.mockResolvedValue(dummy);

      const res = await request(app).get('/api/poi/products');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(dummy);
    });

    it('500 on error', async () => {
      poiModel.getProductsDetailsView.mockRejectedValue(new Error());
      const res = await request(app).get('/api/poi/products');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/poi/productsuppliers', () => {
    it('200 + product-supplier relations', async () => {
      const dummy = [{ product_id: 1, supplier_id: 2 }];
      poiModel.getProductSuppliersDetailsView.mockResolvedValue(dummy);

      const res = await request(app).get('/api/poi/productsuppliers');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(dummy);
    });

    it('500 on error', async () => {
      poiModel.getProductSuppliersDetailsView.mockRejectedValue(new Error());
      const res = await request(app).get('/api/poi/productsuppliers');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/poi/inventory', () => {
    it('200 + inventory', async () => {
      const dummy = [{ inventory_id: 5, quantity: 100 }];
      poiModel.getInventoryDetailsView.mockResolvedValue(dummy);

      const res = await request(app).get('/api/poi/inventory');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(dummy);
    });

    it('500 on error', async () => {
      poiModel.getInventoryDetailsView.mockRejectedValue(new Error());
      const res = await request(app).get('/api/poi/inventory');
      expect(res.status).toBe(500);
    });
  });

  //
  //------ WRITE (POST, PUT, DELETE) ENDPOINTS ------
  //
  describe('POST /api/poi/category/add', () => {
    it('201 + success message', async () => {
      poiModel.addCategory.mockResolvedValue(1);
      const payload = { category_name: 'NewCat', description: 'Desc' };

      const res = await request(app)
        .post('/api/poi/category/add')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Category added successfully' });
      expect(poiModel.addCategory).toHaveBeenCalledWith('NewCat', 'Desc');
    });

    it('500 on error', async () => {
      poiModel.addCategory.mockRejectedValue(new Error('oops'));
      const res = await request(app)
        .post('/api/poi/category/add')
        .send({ category_name: 'x', description: 'y' });
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/poi/category/update', () => {
    it('200 + success message', async () => {
      poiModel.updateCategory.mockResolvedValue(1);
      const payload = { category_id: 1, category_name: 'Upd', description: 'D' };

      const res = await request(app)
        .put('/api/poi/category/update')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Category updated successfully' });
      expect(poiModel.updateCategory).toHaveBeenCalledWith(1, 'Upd', 'D');
    });

    it('500 on error', async () => {
      poiModel.updateCategory.mockRejectedValue(new Error());
      const res = await request(app)
        .put('/api/poi/category/update')
        .send({});
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/poi/category/delete/:category_id', () => {
    it('200 + success message', async () => {
      poiModel.deleteCategory.mockResolvedValue(1);
      const res = await request(app).delete('/api/poi/category/delete/42');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Category deleted successfully' });
      expect(poiModel.deleteCategory).toHaveBeenCalledWith('42');
    });

    it('500 on error', async () => {
      poiModel.deleteCategory.mockRejectedValue(new Error());
      const res = await request(app).delete('/api/poi/category/delete/99');
      expect(res.status).toBe(500);
    });
  });

  // Suppliers
  describe('POST /api/poi/supplier/add', () => {
    it('201 + success message', async () => {
      poiModel.addSupplier.mockResolvedValue(1);
      const payload = { supplier_name: 'S', contact_person: 'C', email: 'e@e', phone: '123', address: 'A' };

      const res = await request(app)
        .post('/api/poi/supplier/add')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Supplier added successfully' });
      expect(poiModel.addSupplier).toHaveBeenCalledWith('S', 'C', 'e@e', '123', 'A');
    });
  });

  describe('PUT /api/poi/supplier/update', () => {
    it('200 + success message', async () => {
      poiModel.updateSupplier.mockResolvedValue(1);
      const p = { supplier_id: 2, supplier_name: 'SS', contact_person: 'CC', email:'x', phone:'y', address:'Z' };

      const res = await request(app)
        .put('/api/poi/supplier/update')
        .send(p);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Supplier updated successfully' });
      expect(poiModel.updateSupplier).toHaveBeenCalledWith(2, 'SS', 'CC', 'x', 'y', 'Z');
    });
  });

  describe('DELETE /api/poi/supplier/delete/:supplier_id', () => {
    it('200 + success message', async () => {
      poiModel.deleteSupplier.mockResolvedValue(1);
      const res = await request(app).delete('/api/poi/supplier/delete/7');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Supplier deleted successfully' });
      expect(poiModel.deleteSupplier).toHaveBeenCalledWith('7');
    });
  });

  // Products
  describe('POST /api/poi/product/add', () => {
    it('201 + success', async () => {
      poiModel.addProduct.mockResolvedValue(1);
      const payload = {
        category_id: 1,
        product_name: 'P',
        description: 'D',
        price: 10,
        cost: 5,
        is_digital: true,
        release_date: '2025-01-01'
      };

      const res = await request(app)
        .post('/api/poi/product/add')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Product added successfully' });
    });
  });

  describe('PUT /api/poi/product/update', () => {
    it('200 + success', async () => {
      poiModel.updateProduct.mockResolvedValue(1);
      const p = {
        product_id: 3,
        category_id: 2,
        product_name: 'X',
        description: 'Y',
        price: 8,
        cost: 4,
        is_digital: false,
        release_date: '2025-02-02'
      };

      const res = await request(app)
        .put('/api/poi/product/update')
        .send(p);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Product updated successfully' });
    });
  });

  describe('DELETE /api/poi/product/delete/:product_id', () => {
    it('200 + success', async () => {
      poiModel.deleteProduct.mockResolvedValue(1);
      const res = await request(app).delete('/api/poi/product/delete/9');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Product deleted successfully' });
    });
  });

  // Product-Supplier
  describe('POST /api/poi/product_supplier/add', () => {
    it('201 + success', async () => {
      poiModel.addProductSupplier.mockResolvedValue(1);
      const res = await request(app)
        .post('/api/poi/product_supplier/add')
        .send({ product_id: 5, supplier_id: 6 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Product-Supplier relation added successfully' });
    });
  });

  describe('DELETE /api/poi/product_supplier/delete/:product_id/:supplier_id', () => {
    it('200 + success', async () => {
      poiModel.deleteProductSupplier.mockResolvedValue(1);
      const res = await request(app).delete('/api/poi/product_supplier/delete/5/6');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Product-Supplier relation deleted successfully' });
    });
  });

  // Inventory
  describe('POST /api/poi/inventory/add', () => {
    it('201 + success', async () => {
      poiModel.addInventory.mockResolvedValue(1);
      const res = await request(app)
        .post('/api/poi/inventory/add')
        .send({ product_id: 10, quantity: 50 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Inventory added successfully' });
    });
  });

  describe('PUT /api/poi/inventory/update', () => {
    it('200 + success', async () => {
      poiModel.updateInventory.mockResolvedValue(1);
      const res = await request(app)
        .put('/api/poi/inventory/update')
        .send({ inventory_id: 11, quantity: 75 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Inventory updated successfully' });
    });
  });

  describe('DELETE /api/poi/inventory/delete/:inventory_id', () => {
    it('200 + success', async () => {
      poiModel.deleteInventory.mockResolvedValue(1);
      const res = await request(app).delete('/api/poi/inventory/delete/12');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Inventory deleted successfully' });
    });
  });
});
