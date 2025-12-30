import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Select, Space, Button, message } from 'antd';
import { schedulePresets, taskTypes } from '../constants'
import { providersApi } from '../../providers/api';

const { Option } = Select;
const { TextArea } = Input;

const CreateEditModal = ({
  visible,
  selectedTask,
  onCancel,
  onCreate,
  onUpdate
}) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [availableTaskTypes, setAvailableTaskTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const editMode = selectedTask?.id;

  // Обновляем доступные типы задач при изменении выбранного провайдера
  useEffect(() => {
    if (selectedProvider?.methods) {
      // Фильтруем типы задач на основе методов выбранного провайдера
      const filteredTypes = taskTypes.filter(type => 
        selectedProvider.methods.some(method => method === type.value)
      );
      setAvailableTaskTypes(filteredTypes);
      
      // Если текущее значение taskType не доступно в отфильтрованном списке, сбрасываем его
      const currentTaskType = form.getFieldValue('taskType');
      if (currentTaskType && !filteredTypes.some(type => type.value === currentTaskType)) {
        form.setFieldsValue({ taskType: null });
      }
    } else {
      setAvailableTaskTypes([]);
      form.setFieldsValue({ taskType: null });
    }
  }, [selectedProvider, form]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await providersApi.getProvidersWithMethods();
      setProviders(response.data);
    } catch (error) {
      message.error('Ошибка при загрузке провайдеров');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    if (editMode && selectedTask) {
      onUpdate(selectedTask.id, values);
    } else {
      onCreate(values);
    }
  };

  // Обработчик выбора провайдера
  const handleProviderChange = (rpoviderId) => {
    const provider = providers.find(s => s.id === rpoviderId);
    setSelectedProvider(provider || null);
  };

  return (
    <Modal
      title="Создание новой задачи"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          schedule: '0 * * * *',
          isActive: true,
          parameters: JSON.stringify({}, null, 2)
        }}
      >
        <Form.Item
          label="Название задачи"
          name="name"
          rules={[{ required: true, message: 'Введите название задачи' }]}
        >
          <Input placeholder="Например: Ежечасное обновление цен" />
        </Form.Item>

        <Form.Item
          label="Провайдер (API)"
          name="apiProviderId"
          help="Выберите поставщика данных"
          rules={[{ required: true, message: 'Выберите API провайдера' }]}
        >
          <Select
            placeholder="Выберите API провайдера"
            onChange={handleProviderChange}
          >
            {providers.map(provider => (
              <Option key={provider.id} value={provider.id}>
                <Space>
                  {provider.icon}
                  {provider.name}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Тип задачи"
          name="taskType"
          rules={[{ required: true, message: 'Выберите тип задачи' }]}
        >
          <Select placeholder="Выберите тип задачи">
            {availableTaskTypes.map((type) => (
              <Option key={type.value} value={type.value}>
                <Space>
                  {type.icon}
                  {type.label}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Расписание"
          name="schedule"
          rules={[{ required: true, message: 'Выберите расписание' }]}
        >
          <Select placeholder="Выберите расписание">
            {schedulePresets.map((preset) => (
              <Option key={preset.value} value={preset.value}>
                {preset.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Параметры задачи (JSON)"
          name="parameters"
          rules={[
            { required: true, message: 'Введите параметры' },
            {
              validator: (_, value) => {
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch {
                  return Promise.reject(new Error('Неверный JSON формат'));
                }
              }
            }
          ]}
        >
          <TextArea
            rows={6}
            placeholder='{"coin_ids": ["bitcoin", "ethereum"], "currencies": ["usd", "eur"]}'
          />
        </Form.Item>

        <Form.Item
          label="Активна"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              Отмена
            </Button>
            <Button type="primary" htmlType="submit">
              Создать
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditModal;
