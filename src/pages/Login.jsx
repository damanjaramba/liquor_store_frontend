import { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      
      if (success) {
        messageApi.success('Login successful!');
        navigate('/');
      } else {
        messageApi.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      messageApi.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen pt-20 px-4 bg-gray-50">
       {contextHolder}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-10">
        <div className="text-center mb-8">
          <Title level={2} className="text-[#722F37] mb-1">Welcome Back</Title>
          <p className="text-gray-600">Sign in to your Damaris Liquor Store account</p>
        </div>
  
        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
  
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
  
          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="text-[#722F37]" href="#">Forgot password?</a>
          </div>
  
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              className="h-12"
            >
              Sign In
            </Button>
          </Form.Item>
  
          <div className="text-center">
            Don't have an account? <Link to="/register" className="text-[#722F37] font-medium">Register now</Link>
          </div>
        </Form>
      </div>
    </div> 
  );
};

export default Login;