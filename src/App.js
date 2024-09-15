import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import { ConfigProvider,theme } from 'antd';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
    theme={{
      components: {
        Modal: {
          titleFontSize: '20px',
          
        },
        Table: {
          headerBg: '#003366',
          headerColor:'white',
          borderColor:'black',
        },
      },
    }}>

    <Router>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </Router>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
