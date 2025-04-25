import { useState } from 'react';
import { Typography, Button, Empty, Steps, Result } from 'antd';
import { ShoppingCartOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Cart = () => {
  const { cartItems, cartTotal, clearCart } = useCart();

  console.log("<<<<<<<",cartTotal)
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };
  console.log("cart item******",cartItems)

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>Shopping Cart</Title>
          
          {cartItems.length > 0 && (
            <Button 
              type="text" 
              danger 
              onClick={() => clearCart()}
            >
              Clear Cart
            </Button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <Result
            icon={<ShoppingCartOutlined style={{ color: '#722F37' }} />}
            title="Your cart is empty"
            subTitle="Looks like you haven't added any items to your cart yet"
            extra={
              <Link to="/">
                <Button type="primary" size="large">
                  Continue Shopping
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <Title level={4} className="mb-4">Order Summary</Title>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>KSh {parseFloat(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>KSh 250</span>
                  </div>
                  <div className="border-t pt-3 font-bold flex justify-between">
                    <span>Total</span>
                    <span>KSh {(parseFloat(cartTotal) + 250)}</span>
                  </div>
                </div>
                
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={proceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-6">
                  <Link to="/">
                    <Button block>Continue Shopping</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;