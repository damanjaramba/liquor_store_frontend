import { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/cart/api/v1`;


console.log('API_BASE_URL:', API_BASE_URL);

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch cart on initial load
  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate cart total whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + (parseFloat(item.liquors[0].price) * item.quantity),
      0
    );
    
    setCartTotal(total);
  }, [cartItems]);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/getCartItems`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCartItems(response.data || []);
      // messageApi.success('Cart items fetched successfully');
    } catch (err) {
      console.error('Error fetching cart:', err);
      // messageApi.error('Failed to fetch cart items');
    } finally {
      setCartLoading(false);
    }
  };

  // Add item to cart via API using query parameters
const addToCart = async (productId, quantity) => {
  try {
    setCartLoading(true);
    const token = localStorage.getItem('token');

    await axios.post(
      `${API_BASE_URL}/addToCart?liquorId=${productId}&quantity=${quantity}`,
      {},
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Refresh cart data after successful addition
    await fetchCart();
messageApi.success('Item added to cart successfully');
    return true;

  } catch (err) {
    console.error('Error adding to cart:', err);
    messageApi.error('Failed to add item to cart');
    throw err;
  } finally {
    setCartLoading(false);
  }
};


  // Update cart item quantity via API
  // const updateCartItemQuantity = async (productId, quantity) => {
  //   try {
  //     setCartLoading(true);
  //     const token = localStorage.getItem('token');
  //     await axios.put(
  //       `${API_BASE_URL}/update`,
  //       {
  //         productId: productId,
  //         quantity: quantity
  //       },
  //       {
  //         headers: {
  //           "ngrok-skip-browser-warning": "true",
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );
      
  //     // Refresh cart data after successful update
  //     await fetchCart();
  //   } catch (err) {
  //     console.error('Error updating cart:', err);
  //     message.error('Failed to update cart');
  //     throw err;
  //   } finally {
  //     setCartLoading(false);
  //   }
  // };

  // Remove item from cart via API
  const removeFromCart = async (productId) => {
    try {
      setCartLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/removeFromCart/${productId}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh cart data after successful removal
      await fetchCart();
      // messageApi.success('Item removed from cart successfully');
    } catch (err) {
      console.error('Error removing from cart:', err);
      // messageApi.error('Failed to remove item from cart');
      throw err;
    } finally {
      setCartLoading(false);
    }
  };

  // Clear entire cart via API
  const clearCart = async () => {
    try {
      setCartLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/clearCart`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCartItems([]);
      // messageApi.success('Cart cleared successfully');
    } catch (err) {
      console.error('Error clearing cart:', err);
      // messageApi.error('Failed to clear cart');
      throw err;
    } finally {
      setCartLoading(false);
    }
  };

  const value = {
    cartItems,
    cartTotal,
    cartLoading,
    addToCart,
    // updateCartItemQuantity,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {contextHolder}
      {children}
    </CartContext.Provider>
  );
};