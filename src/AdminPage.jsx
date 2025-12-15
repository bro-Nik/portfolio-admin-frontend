import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Breadcrumb,
  Space,
  Typography,
  Avatar,
  Dropdown,
  Button
} from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  LogoutOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { useAuthStore } from '/app/src/stores/authStore';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('tasks');
  const { user, logout } = useAuthStore();

  const sidebarMenu = [
    {
      key: 'api-services',
      icon: <ApiOutlined />,
      label: 'API Сервисы'
    },
  ];

  const userMenu = [
    {
      key: 'profile',
      label: 'Профиль',
      icon: <UserOutlined />,
      disabled: true,
    },
    {
      key: 'settings',
      label: 'Настройки',
      icon: <SettingOutlined />,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Выйти',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout
    },
  ];

  const renderContent = () => {
    return '';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        width={250}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Space orientation="vertical" size="small">
            <Avatar 
              size={collapsed ? 32 : 48} 
              src="/favicon.png"
              shape="square"
            />
            {!collapsed && (
              <>
                <Title level={5} style={{ margin: 0 }}>
                  Portfolios Admin
                </Title>
                <Typography.Text type="secondary">
                  Панель управления
                </Typography.Text>
              </>
            )}
          </Space>
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={sidebarMenu}
          onSelect={({ key }) => setSelectedMenu(key)}
          style={{ borderRight: 0, marginTop: '16px' }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Breadcrumb style={{ marginLeft: '16px' }}>
              <Breadcrumb.Item>Главная</Breadcrumb.Item>
              <Breadcrumb.Item>
                {sidebarMenu.find(item => item.key === selectedMenu)?.label || ''}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Space>

          <Space size="large">
            <Button 
              type="text" 
              icon={<BellOutlined />}
              shape="circle"
            />
            
            <Dropdown menu={{items: userMenu}} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                {!collapsed && (
                  <Typography.Text strong>
                    {user?.login}
                  </Typography.Text>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ 
          margin: '16px', 
          padding: 24,
          background: '#fff',
          borderRadius: '8px',
          minHeight: 280
        }}>
          {renderContent()}
        </Content>

      </Layout>
    </Layout>
  );
};

export default AdminPage;
