import { useState, useEffect } from 'react';
import { Typography, Table, Button, Modal, Form, Space, Popconfirm, Avatar, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAdmin } from '../../context/AdminContext';
import ProductForm from './ProductForm';

const { Title } = Typography;

const ProductsManagement = () => {
  const { 
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    categories 
  } = useAdmin();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Transform API product data to form format
  const transformProductToFormData = (product) => {
    if (!product) return null;
    
    return {
      name: product.title,
      price: parseFloat(product.price),
      category: product.category,
      description: product.description,
      quantity: product.quantity,
      image: product.imageUrl
    };
  };

  // Transform form data to API format
  const transformFormToApiData = (formData) => {
    return {
      name: formData.name,
      price: formData.price,
      category: formData.category,
      description: formData.description,
      quantity: formData.quantity,
      image: formData.image
    };
  };

  const handleAddEdit = (product = null) => {
    setEditingProduct(product);
    form.resetFields();
    
    if (product) {
      form.setFieldsValue(transformProductToFormData(product));
    }
    
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const apiData = transformFormToApiData(values);
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, apiData);
      } else {
        await addProduct(apiData);
      }
      
      setIsModalVisible(false);
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const columns = [
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
      key: 'category',
      filters: products
        .map(p => p.category)
        .filter((value, index, self) => self.indexOf(value) === index) // Get unique categories
        .map(category => ({ text: category, value: category })),
      onFilter: (value, record) => record.category === value
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleAddEdit(record)}
            type="primary"
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => deleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              type="primary" 
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (error) {
    return (
      <div className="text-center p-8">
        <Title level={3} type="danger">Error loading products</Title>
        <p>{error}</p>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Products Management</Title>
        <Space>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => handleAddEdit()}
          >
            Add New Product
          </Button>
        </Space>
      </div>
      
      <Spin spinning={loading}>
        <Table 
          dataSource={products}
          columns={columns}
          rowKey="id"
        />
      </Spin>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        confirmLoading={loading}
      >
        <ProductForm form={form} initialValues={editingProduct ? transformProductToFormData(editingProduct) : null} />
      </Modal>
    </div>
  );
};

export default ProductsManagement;