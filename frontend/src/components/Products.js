import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createProduct, updateProduct, deleteProduct } from '../graphql/mutations';
import { getProducts, getProduct } from '../graphql/queries';
import { v4 as uuidv4 } from 'uuid';

const client = generateClient();

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ Name: '', Price: '', Description: '', Category: '', Stock: '' });
  const [error, setError] = useState(null);
  const [lastKey, setLastKey] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts(nextToken = null) {
    try {
      const result = await client.graphql({
        query: getProducts,
        variables: { limit: 20, lastKey: nextToken }
      });
      
      if (result.data.getProducts.__typename === 'APIError') {
        setError(result.data.getProducts.error);
      } else {
        setProducts(result.data.getProducts.products);
        setLastKey(result.data.getProducts.lastKey);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('An error occurred while fetching products.');
    }
  }

  async function handleCreateProduct(e) {
    e.preventDefault();
    try {
      const result = await client.graphql({
        query: createProduct,
        variables: {ProductId: uuidv4(), ...formData}
      });
      
      if (result.data.createProduct.__typename === 'APIError') {
        setError(result.data.createProduct.error);
      } else {
        setFormData({ Name: '', Price: '', Description: '', Category: '', Stock: '' });
        fetchProducts();
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError('An error occurred while creating the product.');
    }
  }

  async function handleUpdateProduct(e) {
    e.preventDefault();
    try {
      const result = await client.graphql({
        query: updateProduct,
        variables: { ProductId: selectedProduct.ProductId, ...formData }
      });
      
      if (result.data.updateProduct.__typename === 'APIError') {
        setError(result.data.updateProduct.error);
      } else {
        setSelectedProduct(null);
        setFormData({ Name: '', Price: '', Description: '', Category: '', Stock: '' });
        fetchProducts();
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('An error occurred while updating the product.');
    }
  }

  async function handleDeleteProduct(ProductId) {
    try {
      const result = await client.graphql({
        query: deleteProduct,
        variables: { ProductId }
      });
      
      if (result.data.deleteProduct.__typename === 'APIError') {
        setError(result.data.deleteProduct.error);
      } else {
        fetchProducts();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('An error occurred while deleting the product.');
    }
  }

  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setFormData({ 
      Name: product.Name, 
      Price: product.Price.toString(), 
      Description: product.Description || '',
      Category: product.Category,
      Stock: product.Stock.toString()
    });
  }

  return (
    <div>
      <h2>Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}>
        <input
          type="text"
          placeholder="Name"
          value={formData.Name}
          onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.Price}
          onChange={(e) => setFormData({ ...formData, Price: parseFloat(e.target.value) })}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.Description}
          onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.Category}
          onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={formData.Stock}
          onChange={(e) => setFormData({ ...formData, Stock: parseInt(e.target.value) })}
          required
        />
        <button type="submit">{selectedProduct ? 'Update' : 'Create'} Product</button>
      </form>
      <ul>
        {products.map((product) => (
          <li key={product.ProductId}>
            {product.Name} - ${product.Price} - Stock: {product.Stock}
            <button onClick={() => handleSelectProduct(product)}>Edit</button>
            <button onClick={() => handleDeleteProduct(product.ProductId)}>Delete</button>
          </li>
        ))}
      </ul>
      {lastKey && <button onClick={() => fetchProducts(lastKey)}>Load More</button>}
    </div>
  );
}

export default Products;