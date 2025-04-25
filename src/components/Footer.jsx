import { GithubOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Damaris Liquor Store</h3>
            <p className="text-gray-400">
              Premium liquor store offering a wide selection of the finest spirits, wines, and beers.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <TwitterOutlined style={{ fontSize: '20px' }} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <InstagramOutlined style={{ fontSize: '20px' }} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <GithubOutlined style={{ fontSize: '20px' }} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Whisky</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Vodka</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Wine</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Beer</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Spirits</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400">
              <p>123 Liquor Street</p>
              <p>Nairobi, Kenya</p>
              <p className="mt-2">Phone: +254 712 345 678</p>
              <p>Email: info@damarisliquor.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Damaris Liquor Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;