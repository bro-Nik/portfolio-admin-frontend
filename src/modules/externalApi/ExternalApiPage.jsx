import React, { useState } from 'react';
import { Tabs } from 'antd';
import ProvidersModule from './providers/ProvidersModule';
import TasksModule from './tasks/TasksModule';

const { TabPane } = Tabs;

const ExternalApiPage = () => {
  const [activeTab, setActiveTab] = useState('providers');

  return (
    <div style={{ padding: '24px' }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="API Провайдеры" key="providers"><ProvidersModule /></TabPane>
        <TabPane tab="Задачи" key="tasks"><TasksModule /></TabPane>
      </Tabs>
    </div>
  );
};

export default ExternalApiPage;
