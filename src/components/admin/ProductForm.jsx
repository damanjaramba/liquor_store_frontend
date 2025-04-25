import { Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { useAdmin } from '../../context/AdminContext';

const { TextArea } = Input;
const { Option } = Select;

const ProductForm = ({ form, initialValues = null }) => {
  const { categories } = useAdmin();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="price"
            label="Price (KSh)"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber 
              min={1}
              style={{ width: '100%' }}
              placeholder="Enter price"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="quantity"
            label="Stock Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber 
              min={0}
              style={{ width: '100%' }}
              placeholder="Enter stock quantity"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="image"
        label="Image URL"
        rules={[{ required: true, message: 'Please enter image URL' }]}
      >
        <Input placeholder="Enter image URL" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <TextArea rows={4} placeholder="Enter product description" />
      </Form.Item>
    </Form>
  );
};

export default ProductForm;