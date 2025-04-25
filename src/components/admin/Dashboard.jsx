import { Typography, Table, Card, Statistic, Row, Col, Divider, Avatar, Spin, Button } from 'antd';
import {
  PlusOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useAdmin } from '../../context/AdminContext';
import { users } from '../../data/staticData';

const { Title } = Typography;

const Dashboard = () => {
  const {  products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    categories } = useAdmin();
  
console.log('products',products)
  // Get unique categories from products
  const uniqueCategories = [...new Set(products?.map(p => p.category))];

  // Product columns for table
  const productColumns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => <Avatar shape="square" size={64} src={imageUrl} />
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Price (KSh)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `KSh ${parseFloat(price).toLocaleString()}`,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price)
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category'
    }
  ];

  if (error) {
    return (
      <div className="text-center p-8">
        <Title level={3} type="danger">Error loading dashboard data</Title>
        <p>{error}</p>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchProducts}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Spin spinning={loading}>
      <div>
        <Title level={3}>Dashboard</Title>
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={products?.length || 0}
                prefix={<PlusOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Categories"
                value={uniqueCategories?.length || 0}
                prefix={<PlusOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Low Stock Items"
                value={products?.filter(p => p.quantity < 20)?.length || 0}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={users?.length || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Divider />
        
        <Title level={4}>Low Stock Products</Title>
        <Table 
          dataSource={products?.filter(p => p.quantity < 20) || []}
          columns={productColumns}
          rowKey="id"
          pagination={false}
        />
      </div>
    </Spin>
  );
};

export default Dashboard;