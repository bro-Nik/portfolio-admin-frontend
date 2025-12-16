import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Tag, Button, message, notification } from 'antd';
import { ApiOutlined, PlusOutlined } from '@ant-design/icons';

import { servicesApi } from './api';
import CreateEditModal from './components/CreateEditModal';
import StatsModal from './components/StatsModal';
import { columns } from './components/ServiceColumns';

const ServicesModule = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceStats, setServiceStats] = useState(null);
  const [serviceLogs, setServiceLogs] = useState([]);
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchPresets();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesApi.getServices();
      setServices(response.data);
    } catch (error) {
      message.error('Ошибка загрузки API сервисов');
    } finally {
      setLoading(false);
    }
  };

  const fetchPresets = async () => {
    try {
      const response = await servicesApi.getServicePresets();
      setPresets(response.data.presets || []);
    } catch (error) {
      console.error('Ошибка загрузки пресетов:', error);
    }
  };

  const fetchServiceStats = async (serviceId) => {
    try {
      const response = await servicesApi.getServiceStats(serviceId);
      setServiceStats(response.data);
    } catch (error) {
      message.error('Ошибка загрузки статистики');
    }
  };

  const fetchServiceLogs = async (serviceId) => {
    try {
      const response = await servicesApi.getServiceLogs(serviceId);
      setServiceLogs(response.data);
    } catch (error) {
      console.error('Ошибка загрузки логов:', error);
    }
  };

  const showServiceDetails = async (service) => {
    setSelectedService(service);
    await fetchServiceStats(service.id);
    await fetchServiceLogs(service.id);
    setStatsModalVisible(true);
  };

  const handleCreateService = async (values) => {
    try {
      await servicesApi.createService(values);
      message.success('API сервис успешно создан');
      setModalVisible(false);
      fetchServices();
    } catch (error) {
      notification.error({
        message: 'Ошибка создания',
        description: error.message
      });
    }
  };

  const handleUpdateService = async (serviceId, values) => {
    try {
      await servicesApi.updateService(serviceId, values);
      message.success('API сервис обновлен');
      setModalVisible(false);
      fetchServices();
    } catch (error) {
      notification.error({
        message: 'Ошибка обновления',
        description: error.message
      });
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await servicesApi.deleteService(serviceId);
      message.success('API сервис удален');
      fetchServices();
    } catch (error) {
      notification.error({
        message: 'Ошибка удаления',
        description: error.message
      });
    }
  };

  const handleResetCounters = async (serviceId) => {
    try {
      await servicesApi.resetCountersServices(serviceId);
      message.success('Счетчики сброшены');
      fetchServices();
      if (selectedService?.id === serviceId) {
        fetchServiceStats(serviceId);
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка сброса',
        description: error.message
      });
    }
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setModalVisible(true);
  };

  const tableColumns = columns({
    showServiceDetails,
    handleEditService,
    handleResetCounters,
    handleDeleteService
  });

  return (
    <>
      <Card
        title={
          <Space>
            <ApiOutlined />
            <span>Управление API сервисами</span>
            <Tag color="blue">{services.length} сервисов</Tag>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddService}
          >
            Добавить сервис
          </Button>
        }
      >
        <Table
          columns={tableColumns}
          dataSource={services}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <CreateEditModal
        visible={modalVisible}
        selectedService={selectedService}
        presets={presets}
        onCancel={() => {
          setModalVisible(false);
          setSelectedService(null);
        }}
        onCreate={handleCreateService}
        onUpdate={handleUpdateService}
      />

      <StatsModal
        visible={statsModalVisible}
        selectedService={selectedService}
        serviceStats={serviceStats}
        serviceLogs={serviceLogs}
        onClose={() => setStatsModalVisible(false)}
        onResetCounters={handleResetCounters}
      />
    </>
  );
};

export default ServicesModule;
