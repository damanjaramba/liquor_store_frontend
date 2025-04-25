import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Badge, Button, Drawer } from 'antd';
import { ShoppingCartOutlined, UserOutlined, MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const userMenu = (
    <Menu>
      {isAdmin && (
        <Menu.Item key="admin">
          <Link to="/admin">Admin Dashboard</Link>
        </Menu.Item>
      )}
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#722F37]">Damaris</span>
            <span className="text-xl font-medium">Liquor Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-[#722F37] font-medium">Home</Link>
            
            {currentUser ? (
              <>
                <Badge count={cartItems.length} size="small">
                  <Link to="/cart" className="text-gray-700 hover:text-[#722F37]">
                    <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                  </Link>
                </Badge>
                <Dropdown overlay={userMenu} placement="bottomRight">
                  <Button type="text" icon={<UserOutlined />} className="flex items-center">
                    {currentUser.name}
                  </Button>
                </Dropdown>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button type="text" className="text-gray-700 hover:text-[#722F37]">Login</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {currentUser && (
              <Badge count={cartItems.length} size="small" className="mr-4">
                <Link to="/cart" className="text-gray-700">
                  <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                </Link>
              </Badge>
            )}
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div className="flex flex-col space-y-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 border-b">
            Home
          </Link>
          
          {currentUser ? (
            <>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 border-b flex items-center justify-between">
                Cart <Badge count={cartItems.length} />
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 border-b">
                  Admin Dashboard
                </Link>
              )}
              <Button 
                onClick={handleLogout}
                type="primary" 
                danger 
                icon={<LogoutOutlined />}
                className="mt-4"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col space-y-3 mt-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button block size="large">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button type="primary" block size="large">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
};

export default Header;