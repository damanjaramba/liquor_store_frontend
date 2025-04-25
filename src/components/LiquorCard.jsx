import { Card, Button, Rate, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const { Meta } = Card;

const LiquorCard = ({ liquor }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setLoading(true);
      // Default to adding 1 item from the card
      await addToCart(liquor.id, 1);
      message.success(`${liquor.title} added to cart`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/liquor/${liquor.id}`}>
      <Card
        hoverable
        className="h-full"
        style={{ overflow: 'hidden' }}
        cover={
          <div className="h-48 overflow-hidden bg-gray-100">
            <img 
              alt={liquor.title} 
              src={liquor.imageUrl} 
              className="w-full h-full object-contain p-4"
            />
          </div>
        }
        actions={[
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            key="view"
          >
            View Details
          </Button>,
          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />} 
            key="add"
            onClick={handleAddToCart}
            loading={loading}
            disabled={liquor.quantity <= 0}
          >
            Add to Cart
          </Button>
        ]}
      >
        <Meta 
          title={liquor.title} 
          description={
            <div>
              <div className="font-bold text-[#722F37] mb-2">
                KSh {parseFloat(liquor.price).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mb-2">category: {liquor.category}</div>
              <div className="text-sm text-gray-500 mb-2">quantity: {liquor.quantity}</div>
              <Rate disabled defaultValue={4} size="small" />
            </div>
          }
        />
      </Card>
    </Link>
  );
};

export default LiquorCard;