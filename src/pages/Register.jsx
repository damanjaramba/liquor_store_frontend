import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Format the mobile number to include the country code
      const mobileNumber = `+254${values.mobileNumber}`;
      
      const success = await register({
        name: values.fullName,
        email: values.email,
        username: values.username,
        password: values.password,
        mobileNumber: mobileNumber
      });
      
      if (success) {
        messageApi.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        messageApi.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      messageApi.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50">
      {contextHolder}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-10">
        <div className="text-center mb-6">
          <Title level={2} className="text-[#722F37] mb-1">Create Account</Title>
          <p className="text-gray-600">Join Damaris Liquor Store for the best selection</p>
        </div>

        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter a username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter a password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item
            name="mobileNumber"
            rules={[{ required: true, message: 'Please enter your mobile number!' }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Mobile Number"
              addonBefore="+254"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              className="h-12"
            >
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            Already have an account? <Link to="/login" className="text-[#722F37] font-medium">Login</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;