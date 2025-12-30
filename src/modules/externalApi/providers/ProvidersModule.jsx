import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Tag, Button, message, notification } from 'antd';
import { ApiOutlined, PlusOutlined } from '@ant-design/icons';

import { providersApi } from './api';
import CreateEditModal from './components/CreateEditModal';
import StatsModal from './components/StatsModal';
import { columns } from './components/ProviderColumns';

const ProvidersModule = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerStats, setProviderStats] = useState(null);
  const [providerLogs, setProviderLogs] = useState([]);
  const [providersWithPresets, setProvidersWithPresets] = useState([]);

  useEffect(() => {
    fetchProviders();
    fetchProvidersWithPresets();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await providersApi.getProviders();
      setProviders(response.data);
    } catch (error) {
      message.error('Ошибка загрузки API провайдеров');
    } finally {
      setLoading(false);
    }
  };

  const fetchProvidersWithPresets = async () => {
    try {
      const response = await providersApi.getProvidersWithPresets();
      setProvidersWithPresets(response.data.presets || []);
    } catch (error) {
      console.error('Ошибка загрузки пресетов:', error);
    }
  };

  const fetchProviderStats = async (providerId) => {
    try {
      const response = await providersApi.getProviderStats(providerId);
      setProviderStats(response.data);
    } catch (error) {
      message.error('Ошибка загрузки статистики');
    }
  };

  const fetchProviderLogs = async (providerId) => {
    try {
      const response = await providersApi.getProviderLogs(providerId);
      setProviderLogs(response.data);
    } catch (error) {
      console.error('Ошибка загрузки логов:', error);
    }
  };

  const showProviderDetails = async (provider) => {
    setSelectedProvider(provider);
    await fetchProviderStats(provider.id);
    await fetchProviderLogs(provider.id);
    setStatsModalVisible(true);
  };

  const handleCreateProvider = async (values) => {
    try {
      await providersApi.createProvider(values);
      message.success('API провайдер успешно создан');
      setSettingsModalVisible(false);
      fetchProviders();
    } catch (error) {
      notification.error({
        message: 'Ошибка создания',
        description: error.message
      });
    }
  };

  const handleUpdateProvider = async (providerId, values) => {
    try {
      await providersApi.updateProvider(providerId, values);
      message.success('API провайдер обновлен');
      setSettingsModalVisible(false);
      fetchProviders();
    } catch (error) {
      notification.error({
        message: 'Ошибка обновления',
        description: error.message
      });
    }
  };

  const handleDeleteProvider = async (providerId) => {
    try {
      await providersApi.deleteProvider(providerId);
      message.success('API провайдер удален');
      fetchProviders();
    } catch (error) {
      notification.error({
        message: 'Ошибка удаления',
        description: error.message
      });
    }
  };

  const handleResetCounters = async (providerId) => {
    try {
      await providersApi.resetCountersProvider(providerId);
      message.success('Счетчики сброшены');
      fetchProviders();
      if (selectedProvider?.id === providerId) {
        fetchProviderStats(providerId);
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка сброса',
        description: error.message
      });
    }
  };

  const handleEditProvider = (provider) => {
    setSelectedProvider(provider);
    setSettingsModalVisible(true);
  };

  const handleAddProvider = () => {
    setSelectedProvider(null);
    setSettingsModalVisible(true);
  };

  const tableColumns = columns({
    showProviderDetails,
    handleEditProvider,
    handleResetCounters,
    handleDeleteProvider
  });

  return (
    <>
      <Card
        title={
          <Space>
            <ApiOutlined />
            <span>Управление API провайдерами</span>
            <Tag color="blue">{providers.length} провайдеров</Tag>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProvider}
          >
            Добавить провайдера
          </Button>
        }
      >
        <Table
          columns={tableColumns}
          dataSource={providers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <CreateEditModal
        visible={settingsModalVisible}
        selectedProvider={selectedProvider}
        providers={providersWithPresets}
        onCancel={() => {
          setSettingsModalVisible(false);
          setSelectedProvider(null);
        }}
        onCreate={handleCreateProvider}
        onUpdate={handleUpdateProvider}
      />

      <StatsModal
        visible={statsModalVisible}
        selectedProvider={selectedProvider}
        providerStats={providerStats}
        providerLogs={providerLogs}
        onClose={() => setStatsModalVisible(false)}
        onResetCounters={handleResetCounters}
      />
    </>
  );
};

export default ProvidersModule;
