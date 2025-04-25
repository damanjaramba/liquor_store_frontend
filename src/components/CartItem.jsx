import { Card, Button, InputNumber, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import Title from 'antd/es/skeleton/Title';

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();
const [messageApi, contextHolder] = message.useMessage();
  const liquor = item.liquors[0]; // Assuming only one liquor per item

  // const handleQuantityChange = (value) => {
  //   updateQuantity(item.id, value);
  // };

  const handleRemove = () => {
    removeFromCart(item.id);
    messageApi.success('Item removed from cart');
  };

  return (
    <Card className="mb-4">
      {contextHolder}
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="w-full sm:w-24 h-24 bg-gray-100 rounded flex-shrink-0 mb-4 sm:mb-0">
          <img 
            src={liquor.imageUrl} 
            alt={liquor.title} 
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div className="flex-grow sm:ml-4">
          <h3 className="font-medium text-lg">{liquor.title}</h3>
          <p className="text-[#722F37] font-bold">KSh {liquor.price}</p>
          <p className="text-[#722F37] font-bold">Quantity: {item.quantity}</p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          
          <div className="ml-6 font-bold">
            KSh {(liquor.price * item.quantity)}
          </div> 
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={handleRemove}
            className="ml-4"
          />
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
