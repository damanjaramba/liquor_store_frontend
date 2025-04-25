import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import LiquorDetail from './pages/LiquorDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';

// A wrapper component to handle location checking
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/liquor/:id" element={<LiquorDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  const { defaultAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,
        token: {
          colorPrimary: '#722F37', // Wine red color as primary
          borderRadius: 6,
          fontFamily: "'Poppins', sans-serif",
        },
      }}
    >
      <Router>
        <AuthProvider>
          <CartProvider>
            <AdminProvider>
              <AppContent />
            </AdminProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;