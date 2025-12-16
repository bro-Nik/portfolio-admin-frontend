import React, { useState } from 'react';
import { Tabs } from 'antd';
import ServicesModule from '/app/src/modules/externalApi/services/ServicesModule';

const { TabPane } = Tabs;

const ExternalApiPage = () => {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div style={{ padding: '24px' }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="API Сервисы" key="services"><ServicesModule /></TabPane>
      </Tabs>
    </div>
  );
};

export default ExternalApiPage;
