const model = require('../models/poiModels');

const getCategoriesDetails = async (req, res) => {
  try {
    const details = await model.getCategoriesDetailsView();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

const getSuppliersDetails = async (req, res) => {
    try {
      const details = await model.getSuppliersDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getProductsDetails = async (req, res) => {
    try {
      const details = await model.getProductsDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getProductSuppliersDetails = async (req, res) => {
    try {
      const details = await model.getProductSuppliersDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  const getInventoryDetails = async (req, res) => {
    try {
      const details = await model.getInventoryDetailsView();
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };


// -------------------- Categories --------------------
const addCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;
    await model.addCategory(category_name, description);
    res.status(201).json({ message: 'Category added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category_id, category_name, description } = req.body;
    await model.updateCategory(category_id, category_name, description);
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    await model.deleteCategory(category_id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Suppliers --------------------
const addSupplier = async (req, res) => {
  try {
    const { supplier_name, contact_person, email, phone, address } = req.body;
    await model.addSupplier(supplier_name, contact_person, email, phone, address);
    res.status(201).json({ message: 'Supplier added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { supplier_id, supplier_name, contact_person, email, phone, address } = req.body;
    await model.updateSupplier(supplier_id, supplier_name, contact_person, email, phone, address);
    res.json({ message: 'Supplier updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { supplier_id } = req.params;
    await model.deleteSupplier(supplier_id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Products --------------------
const addProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, price, cost, is_digital, release_date } = req.body;
    await model.addProduct(category_id, product_name, description, price, cost, is_digital, release_date);
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product_id, category_id, product_name, description, price, cost, is_digital, release_date } = req.body;
    await model.updateProduct(product_id, category_id, product_name, description, price, cost, is_digital, release_date);
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    await model.deleteProduct(product_id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Product_Suppliers --------------------
const addProductSupplier = async (req, res) => {
  try {
    const { product_id, supplier_id } = req.body;
    await model.addProductSupplier(product_id, supplier_id);
    res.status(201).json({ message: 'Product-Supplier relation added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProductSupplier = async (req, res) => {
  try {
    const { product_id, supplier_id } = req.params;
    await model.deleteProductSupplier(product_id, supplier_id);
    res.json({ message: 'Product-Supplier relation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Inventory --------------------
const addInventory = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    await model.addInventory(product_id, quantity);
    res.status(201).json({ message: 'Inventory added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { inventory_id, quantity } = req.body;
    await model.updateInventory(inventory_id, quantity);
    res.json({ message: 'Inventory updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const { inventory_id } = req.params;
    await model.deleteInventory(inventory_id);
    res.json({ message: 'Inventory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports = {
  getCategoriesDetails,
  getSuppliersDetails,
  getProductsDetails,
  getProductSuppliersDetails,
  getInventoryDetails,
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
  deleteInventory
};
