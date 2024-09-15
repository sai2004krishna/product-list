import React from 'react';
import { Form, Input, Button, Select, notification, Spin } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 20px auto;
  border: solid black;
`;

const Header = styled.div`
  background-color: #003366; 
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const SubmitButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

const fetchCategories = async () => {
  const { data } = await axios.get('https://dummyjson.com/products/categories');
  return data;
};

const addProduct = async (product) => {
  const { data } = await axios.post('https://dummyjson.com/products/add', product);
  return data;
};

const Page2 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
   
  });

  const productMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      notification.success({
        message: 'Product Added',
        description: `Product ${data.title} added successfully.`,
      });
      console.log(data);
      navigate('/');
    },
    onError: () => {
      notification.error({
        message: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    },
  });

  React.useEffect(() => {
    if (state?.product) {
      form.setFieldsValue(state.product);
    }
  }, [state?.product, form]);

  const handleSubmit = (values) => {
    productMutation.mutate(values);
  };

  if (categoriesQuery.isLoading) return <Spin tip="Loading categories..." />;

  return (
    <Wrapper>
      <Header>Confirm Product</Header>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Enter the product title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Enter the product price' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Select the product category' }]}
        >
          <Select>
            {categoriesQuery.data?.map((cat) => (
              <Select.Option key={cat} value={cat}>
                {cat}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <SubmitButton
          type="primary"
          htmlType="submit"
          loading={productMutation.isLoading}
        >
          Confirm
        </SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default Page2;
