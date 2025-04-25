import { useState } from 'react';
import { Typography, Button, Steps, Form, Input, Radio, Divider, Result, message } from 'antd';
import { ShopOutlined, UserOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const { Title, Text } = Typography;
const { Step } = Steps;
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [mpesaNumber, setMpesaNumber] = useState(
    currentUser?.mobileNumber?.replace('+254', '') || ''
  );
  const [messageApi, contextHolder] = message.useMessage();

  const steps = [
    {
      title: 'Information',
      icon: <UserOutlined />
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />
    },
    {
      title: 'Confirmation',
      icon: <CheckCircleOutlined />
    }
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      messageApi.error('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Using the mpesaNumber state instead of trying to get it from the form
      if (!mpesaNumber) {
        messageApi.error('Please enter your M-PESA number',1);
        setLoading(false);
        return;
      }
      
      // Get the authorization token from local storage
      const token = localStorage.getItem('token');
      
      // Make API call to STK Push endpoint using axios with authorization header
      const response = await axios.post(
        API_BASE_URL+"/payments/api/v1/stkPush", 
        {
          mobileNumber: mpesaNumber,
          amount: cartTotal
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Handle successful response
      messageApi.success('Payment initiated. Check your phone for the M-PESA prompt.');
      
      // Proceed to confirmation after successful payment initiation
      setPaymentComplete(true);
      setCurrentStep(currentStep + 1);
      clearCart();
    } catch (error) {
      console.error('Payment error:', error);
      messageApi.error('Payment failed. Please try again.',error.message);
    } finally {
      setLoading(false);
    }
  };
    
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form 
            form={form}
            layout="vertical"
            initialValues={{
              fullName: currentUser?.fullName || '',
              phoneNumber: currentUser?.mobileNumber || '',
              email: currentUser?.email || '',
              deliveryOption: 'delivery'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Title level={4} className="mb-4">Contact Information</Title>
                
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input size="large" />
                </Form.Item>
                
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input 
                    size="large" 
                    addonBefore="+254"
                  />
                </Form.Item>
                
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              
              <div>
                <Title level={4} className="mb-4">Delivery Options</Title>
                
                <Form.Item name="deliveryOption">
                  <Radio.Group className="w-full">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 hover:border-[#722F37] transition-colors cursor-pointer">
                        <Radio value="delivery">
                          Standard Delivery (KSh 250)
                          <p className="ml-6 text-gray-500">Delivery within 24 hours</p>
                        </Radio>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:border-[#722F37] transition-colors cursor-pointer">
                        <Radio value="pickup">
                          Store Pickup (Free)
                          <p className="ml-6 text-gray-500">Ready for pickup in 2 hours</p>
                        </Radio>
                      </div>
                    </div>
                  </Radio.Group>
                </Form.Item>
                
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.deliveryOption !== currentValues.deliveryOption}
                >
                  {({ getFieldValue }) => 
                    getFieldValue('deliveryOption') === 'delivery' ? (
                      <Form.Item
                        name="address"
                        label="Delivery Address"
                        rules={[{ required: true, message: 'Please enter your delivery address' }]}
                      >
                        <Input.TextArea 
                          rows={3} 
                          size="large" 
                          placeholder="Enter your full delivery address"
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </div>
            </div>
          </Form>
        );
        
      case 1:
        return (
          <div>
            <Title level={4} className="mb-4">Payment Method</Title>
            
            <div className="border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-medium mb-1">M-PESA Payment</div>
                  <div className="text-gray-500">Pay with M-PESA mobile money</div>
                </div>
                <img 
                  src="https://i.pinimg.com/236x/32/11/ad/3211ad90e9f24e7cda29fa93072959d2.jpg" 
                  alt="M-PESA" 
                  className="h-8 object-contain"
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm text-gray-500 mb-2">
                  Enter your phone number to receive payment prompt
                </div>
                
                {/* Removed standalone Form component and using direct input with state */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">M-PESA Number</label>
                  <Input 
                    size="large" 
                    addonBefore="+254"
                    placeholder="7XXXXXXXX"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className="text-sm text-gray-500 mt-4">
                  You will receive an STK push notification on your phone to complete the payment
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <Title level={5} className="mb-3">Order Summary</Title>
              
              <div className="space-y-2 mb-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.liquors[0].title} (x{item.quantity})</span>
                    <span>KSh {(item.liquors[0].price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <Divider className="my-3" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>KSh 250</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>KSh {(cartTotal + 250).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <Result
            status="success"
            title="Payment Successful!"
            subTitle={`Order number: ${Math.floor(100000000 + Math.random() * 900000000)}`}
            extra={[
              <Button 
                type="primary" 
                key="home" 
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            ]}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      {contextHolder}
      <div className="container mx-auto py-8">
        <Title level={2} className="mb-6">Checkout</Title>
        
        <Steps current={currentStep} className="mb-8">
          {steps.map(step => (
            <Step 
              key={step.title} 
              title={step.title} 
              icon={step.icon} 
            />
          ))}
        </Steps>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderStepContent()}
          
          {currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <Button onClick={handlePrevious}>
                  Back
                </Button>
              ) : (
                <Link to="/cart">
                  <Button>
                    Back to Cart
                  </Button>
                </Link>
              )}
              
              {currentStep === 0 ? (
                <Button type="primary" onClick={handleNext}>
                  Continue to Payment
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handlePayment}
                  loading={loading}
                >
                  Pay Now
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Cart Summary */}
        {currentStep < steps.length - 1 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <Title level={4} className="mb-4">
              <ShopOutlined className="mr-2" />
              Cart Summary
            </Title>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">Your cart is empty</div>
                <Link to="/">
                  <Button type="primary">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center">
                       {console.log("from checkout",item)}
                      <img 
                        src={item.liquors[0].imageUrl} 
                        alt={item.liquors[0].title}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.liquors[0].title}</div>
                        <div className="text-gray-500">Quantity: {item.quantity}</div>
                      </div>
                      <div className="font-medium">
                        KSh {(item.liquors[0].price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Divider />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>KSh {cartTotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>KSh 250</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>KSh {(cartTotal + 250).toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;