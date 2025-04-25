import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, InputNumber, Rate, Breadcrumb, Spin, message, Tabs } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const LiquorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { fetchProductById, products, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [liquor, setLiquor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchLiquorData = async () => {
      setLoading(true);
      try {
        // Fetch the specific liquor by ID from the API
        const liquorData = await fetchProductById(id);
        
        // Format the liquor data for consistent usage in the component
        setLiquor({
          id: liquorData.id,
          name: liquorData.title,
          price: parseFloat(liquorData.price),
          description: liquorData.description,
          image: liquorData.imageUrl,
          quantity: liquorData.quantity,
          category: liquorData.category
        });
      } catch (error) {
        console.error("Error fetching liquor details:", error);
        messageApi.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLiquorData();
    }
  }, []);

  // Separate useEffect for related products to avoid infinite loop
  useEffect(() => {
    if (liquor && products.length > 0) {
      // Set related products (products in the same category)
      const related = products
        .filter(item => item.id !== parseInt(id) && item.category === liquor.category)
        .slice(0, 4);
      
      setRelatedProducts(related);
    }
  }, [liquor, products, id]);

  const handleAddToCart = async () => {
    if (liquor) {
      setAddingToCart(true);
      try {
        // Use the API function from CartContext
        await addToCart(liquor.id, quantity);
        messageApi.success(`${liquor.name} added to cart`);
      } catch (error) {
        messageApi.error("Failed to add item to cart:", error);
      } finally {
        setAddingToCart(false);
      }
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!liquor) {
    return (
      <div className="min-h-screen pt-20 px-4">
        {contextHolder}
        <div className="container mx-auto text-center py-20">
          <Title level={2}>Product Not Found</Title>
          <Paragraph>The product you are looking for does not exist.</Paragraph>
          <Button type="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto py-8">
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <a onClick={() => navigate('/')}>Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => navigate('/')}>Liquors</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{liquor.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Button
          icon={<ArrowLeftOutlined />}
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
              <img 
                src={liquor.image} 
                alt={liquor.name} 
                className="max-h-80 object-contain"
              />
            </div>

            <div>
              <Title level={2}>{liquor.name}</Title>
              
              <div className="flex items-center mb-4">
                <Rate disabled defaultValue={4} />
                <span className="text-gray-500 ml-2">(24 reviews)</span>
              </div>
              
              <div className="text-2xl font-bold text-[#722F37] mb-6">
                KSh {liquor.price.toLocaleString()}
              </div>
              
              <Paragraph className="mb-6">
                {liquor.description}
              </Paragraph>
              
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Quantity</div>
                <div className="flex items-center">
                  <InputNumber 
                    min={1} 
                    max={liquor.quantity}
                    value={quantity}
                    onChange={value => setQuantity(value)}
                    className="w-24"
                  />
                  <span className="ml-4 text-sm text-gray-500">
                    {liquor.quantity} in stock
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={liquor.quantity <= 0 || addingToCart}
                  loading={addingToCart}
                >
                  Add to Cart
                </Button>
                
                <Button 
                  size="large"
                  onClick={handleBuyNow}
                  disabled={liquor.quantity <= 0 || addingToCart}
                  loading={addingToCart}
                >
                  Buy Now
                </Button>
                
                <Button 
                  type="text" 
                  icon={<HeartOutlined />} 
                  size="large"
                >
                  Wishlist
                </Button>
                
                <Button 
                  type="text" 
                  icon={<ShareAltOutlined />} 
                  size="large"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Fixed Tabs component - Using key to ensure proper rendering */}
          <Tabs defaultActiveKey="1" className="px-6 pb-6" destroyInactiveTabPane>
            <TabPane tab="Description" key="1">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-3">Product Details</h3>
                <p className="mb-4">{liquor.description}</p>
                <p>
                  Experience the exceptional quality and flavor of {liquor.name}. 
                  This premium liquor is perfect for any occasion, whether you're entertaining 
                  guests or enjoying a quiet evening at home.
                </p>
                <p className="mt-4">
                  <strong>Category:</strong> {liquor.category}
                </p>
              </div>
            </TabPane>
            
            <TabPane tab="Reviews" key="2">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-3">Customer Reviews</h3>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <strong className="mr-2">John D.</strong>
                    <Rate disabled defaultValue={5} size="small" />
                    <span className="text-xs text-gray-500 ml-2">2 weeks ago</span>
                  </div>
                  <p>Excellent product! Smooth taste and great value for the price.</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <strong className="mr-2">Mary S.</strong>
                    <Rate disabled defaultValue={4} size="small" />
                    <span className="text-xs text-gray-500 ml-2">1 month ago</span>
                  </div>
                  <p>Very good quality. Will definitely buy again!</p>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <Title level={3} className="mb-6">You May Also Like</Title>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/liquor/${item.id}`)}
                >
                  <div className="h-32 bg-gray-50 p-2 flex items-center justify-center">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 truncate">{item.title}</h3>
                    <div className="text-[#722F37] font-bold">
                      KSh {parseFloat(item.price).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiquorDetail;