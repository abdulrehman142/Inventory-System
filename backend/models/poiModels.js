const { poolPromise } = require('../config/db');

const getCategoriesDetailsView = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM vwCategories');
  return result.recordset;
};

const getSuppliersDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwSuppliers');
    return result.recordset;
};

const getProductsDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwProducts');
    return result.recordset;
  };

  const getProductSuppliersDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwProductSuppliers');
    return result.recordset;
  };

  const getInventoryDetailsView = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vwInventory');
    return result.recordset;
  };


  // -------------------- Categories --------------------
const addCategory = async (category_name, description) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('category_name', category_name)
    .input('description', description)
    .execute('spAddCategory');
  return result.rowsAffected;
};

const updateCategory = async (category_id, category_name, description) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('category_id', category_id)
    .input('category_name', category_name)
    .input('description', description)
    .execute('spUpdateCategory');
  return result.rowsAffected;
};

const deleteCategory = async (category_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('category_id', category_id)
    .execute('spDeleteCategory');
  return result.rowsAffected;
};

// -------------------- Suppliers --------------------
const addSupplier = async (supplier_name, contact_person, email, phone, address) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('supplier_name', supplier_name)
    .input('contact_person', contact_person)
    .input('email', email)
    .input('phone', phone)
    .input('address', address)
    .execute('spAddSupplier');
  return result.rowsAffected;
};

const updateSupplier = async (supplier_id, supplier_name, contact_person, email, phone, address) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('supplier_id', supplier_id)
    .input('supplier_name', supplier_name)
    .input('contact_person', contact_person)
    .input('email', email)
    .input('phone', phone)
    .input('address', address)
    .execute('spUpdateSupplier');
  return result.rowsAffected;
};

const deleteSupplier = async (supplier_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('supplier_id', supplier_id)
    .execute('spDeleteSupplier');
  return result.rowsAffected;
};

// -------------------- Products --------------------
const addProduct = async (category_id, product_name, description, price, cost, is_digital, release_date) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('category_id', category_id)
    .input('product_name', product_name)
    .input('description', description)
    .input('price', price)
    .input('cost', cost)
    .input('is_digital', is_digital)
    .input('release_date', release_date)
    .execute('spAddProduct');
  return result.rowsAffected;
};

const updateProduct = async (product_id, category_id, product_name, description, price, cost, is_digital, release_date) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('product_id', product_id)
    .input('category_id', category_id)
    .input('product_name', product_name)
    .input('description', description)
    .input('price', price)
    .input('cost', cost)
    .input('is_digital', is_digital)
    .input('release_date', release_date)
    .execute('spUpdateProduct');
  return result.rowsAffected;
};

const deleteProduct = async (product_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('product_id', product_id)
    .execute('spDeleteProduct');
  return result.rowsAffected;
};

// -------------------- Product_Suppliers --------------------
const addProductSupplier = async (product_id, supplier_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('product_id', product_id)
    .input('supplier_id', supplier_id)
    .execute('spAddProductSupplier');
  return result.rowsAffected;
};

const deleteProductSupplier = async (product_id, supplier_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('product_id', product_id)
    .input('supplier_id', supplier_id)
    .execute('spDeleteProductSupplier');
  return result.rowsAffected;
};

// -------------------- Inventory --------------------
const addInventory = async (product_id, quantity) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('product_id', product_id)
    .input('quantity', quantity)
    .execute('spAddInventory');
  return result.rowsAffected;
};

const updateInventory = async (inventory_id, quantity) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('inventory_id', inventory_id)
    .input('quantity', quantity)
    .execute('spUpdateInventory');
  return result.rowsAffected;
};

const deleteInventory = async (inventory_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('inventory_id', inventory_id)
    .execute('spDeleteInventory');
  return result.rowsAffected;
};


module.exports = {
  getCategoriesDetailsView,
  getSuppliersDetailsView,
  getProductsDetailsView,
  getProductSuppliersDetailsView,
  getInventoryDetailsView,
  addCategory,
  updateCategory,
  deleteCategory,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  addProduct,
  updateProduct,
  deleteProduct,
  addProductSupplier,
  deleteProductSupplier,
  addInventory,
  updateInventory,
  deleteInventory,
};
