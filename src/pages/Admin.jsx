import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import ProductsManagement from '../components/admin/ProductsManagement';

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // Check if user is admin
    if (!currentUser || currentUser.role !== 'ADMIN') {
      messageApi.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <AdminLayout>
      {contextHolder}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductsManagement />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;