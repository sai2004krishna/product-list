import React, { useState } from 'react';
import { DatePicker, Input, Button, Modal, Select, Table, Form, notification } from 'antd';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { RangePicker } = DatePicker;
const { Search } = Input;

const Wrapper = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  background-color: #003366; 
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Dropdown = styled(Select)`
  margin-left: 20px;
  width: 200px;
`;

const AddButton = styled(Button)`
  margin-left: 20px;
`;

const fetchCategories = async () => {
  const { data } = await axios.get('https://dummyjson.com/products/categories');
  return data;
};

const fetchProducts = async ({ queryKey }) => {
  const [, { search, sortBy }] = queryKey;
  const { data } = await axios.get(`https://dummyjson.com/products/search?q=${search}&sortBy=${sortBy}&order=asc`);
  return data.products;
};

const Page1 = () => {
  const [range, setRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { search, sortBy }],
    queryFn: fetchProducts
  });

  const onDateChange = (dates) => setRange(dates);

  const onSearch = (value) => setSearch(value);

  const onSortChange = (value) => setSortBy(value);

  const openModal = () => setIsModalOpen(true);

  const onModalOk = () => {
    form.validateFields().then((values) => {
      setFormData(values);
      setIsModalOpen(false);
      navigate('/page2', { state: { product: values } });
    });
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
  ];

  return (
    <Wrapper>
      <Header>Product List</Header>
      <Controls>
        <RangePicker
          defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
          onChange={onDateChange}
          disabledDate={(current) => current && current > dayjs().endOf('day')}
        />
        <Search
          placeholder="Search products"
          onSearch={onSearch}
          style={{ width: 200, marginLeft: '20px' }}
        />
        <Dropdown defaultValue="title" onChange={onSortChange}>
          <Select.Option value="title">Title</Select.Option>
          <Select.Option value="price">Price</Select.Option>
        </Dropdown>
        <AddButton type="primary" onClick={openModal}>
          Add Product
        </AddButton>
      </Controls>

      <Modal
        title="Add Product"
        visible={isModalOpen}
        onOk={onModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Enter the title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Enter the price' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Select a category' }]}>
            <Select>
              {categories?.map((cat) => (
                <Select.Option key={cat.slug} value={cat.slug}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 8 }}
      />
    </Wrapper>
  );
};

export default Page1;
