import { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';

// Categories from the enum
const LIQUOR_CATEGORIES = [
  'BEER', 'WINE', 'SPIRITS', 'COCKTAILS', 'WHISKEY', 
  'VODKA', 'RUM', 'GIN', 'TEQUILA', 'BRANDY', 'CIDER'
];

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products function
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/public/api/v1/allLiquors`,{
        headers: {
        "ngrok-skip-browser-warning": "true",
    }});
      const data = await response.data
      console.log('>>>>>>>',data)
      setProducts(data);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product by ID
  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/public/api/v1/liquor/${id}`,{
        headers: {
        "ngrok-skip-browser-warning": "true",
    }});
      
      return response.data;
    } catch (err) {
      console.error(`Error fetching product with ID ${id}:`, err);
      message.error('Failed to fetch product details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/admin/api/v1/addLiquor`,
        {
          title: productData.name,
          price: productData.price.toString(),
          category: productData.category,
          description: productData.description,
          quantity: productData.quantity,
          imageUrl: productData.image
        },{
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh the products list
      await fetchProducts();
      
      message.success('Product added successfully');
      return response.data;
    } catch (err) {
      console.error('Error adding product:', err);
      message.error('Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
  
      const token = localStorage.getItem('token'); 

      console.log("token from local storage",token)
      await axios.put(
        `${API_BASE_URL}/admin/api/v1/updateLiquor/${id}`,
        {
          title: productData.name,
          price: productData.price.toString(),
          category: productData.category,
          description: productData.description,
          quantity: productData.quantity,
          imageUrl: productData.image
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      // Refresh the products list
      await fetchProducts();
  
      message.success('Product updated successfully');
    } catch (err) {
      console.error(`Error updating product with ID ${id}:`, err);
      message.error('Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); 
  
      await axios.delete(`${API_BASE_URL}/admin/api/v1/deleteLiquor/${id}`,{
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh the products list
      await fetchProducts();
      
      message.success('Product deleted successfully');
    } catch (err) {
      console.error(`Error deleting product with ID ${id}:`, err);
      message.error('Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    categories: LIQUOR_CATEGORIES // Exposing the enum categories
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};