import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Typography, 
  Button, 
  Avatar
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  PlusOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  // Determine the current active tab from URL
  const getActiveTab = () => {
    if (location.pathname.includes('/admin/products')) return 'products';
    return 'dashboard';
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'products':
        navigate('/admin/products');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        navigate('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div className="logo p-4">
          <Title level={4} >
            <Link to="/" style={{ color: 'white', margin: 0, textAlign: 'center' }}>{collapsed ? 'DL' : 'Damaris Liquor'}</Link>
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getActiveTab()]}
          onSelect={({ key }) => handleMenuClick(key)}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: 'Dashboard'
            },
            {
              key: 'products',
              icon: <PlusOutlined />,
              label: 'Products'
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout'
            }
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff' }}>
          <div className="flex justify-between items-center px-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <div className="flex items-center">
              <Text strong className="mr-2">{currentUser?.fullName}</Text>
              <Avatar icon={<UserOutlined />} />
            </div>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;