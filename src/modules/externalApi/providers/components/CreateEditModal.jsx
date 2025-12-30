import React from 'react';
import { Modal, Form, Input, InputNumber, Switch, Row, Col, Select, Divider, Space, Button } from 'antd';
import { ApiOutlined, LinkOutlined, KeyOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateEditModal = ({
  visible,
  selectedProvider,
  providers,
  onCancel,
  onCreate,
  onUpdate
}) => {
  const [form] = Form.useForm();
  const editMode = selectedProvider?.id;

  const initialValues = {
    requestsPerMinute: 30,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    requestsPerMonth: 30000,
    retryDelay: 60,
    timeout: 30,
    isActive: true
  };

  const loadPreset = (providerName) => {
    const provider = providers.find(p => p.name === providerName);
    if (provider) {
      form.setFieldsValue({
        name: provider.name,
        requestsPerMinute: provider.requestsPerMinute,
        requestsPerHour: provider.requestsPerHour,
        requestsPerDay: provider.requestsPerDay,
        requestsPerMonth: provider.requestsPerMonth,
        timeout: provider.timeout,
        retryDelay: 60,
        isActive: true
      });
    }
  };

  const handleSubmit = (values) => {
    if (editMode && selectedProvider) {
      onUpdate(selectedProvider.id, values);
    } else {
      onCreate(values);
    }
  };

  return (
    <Modal
      title={editMode ? 'Редактировать API провайдера' : 'Создать новый API провайдер'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={editMode ? { ...selectedProvider, apiKey: selectedProvider?.apiKey ? '***' : '' } : initialValues}
      >
        <Form.Item
          label="Провайдер"
          rules={[{ required: true, message: 'Введите провайдера' }]}
        >
          <Select
            placeholder="Выберите провайдера"
            onChange={loadPreset}
            prefix={<ApiOutlined />}
            allowClear
          >
            {providers.map(provider => (
              <Option key={provider.name} value={provider.name}>
                {provider.displayName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="API Ключ (опционально)"
          name="apiKey"
          extra="Оставьте пустым, если не требуется"
        >
          <Input.Password 
            placeholder="Введите API ключ" 
            prefix={<KeyOutlined />}
          />
        </Form.Item>

        <Divider orientation="left">Лимиты запросов</Divider>
        
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="В минуту"
              name="requestsPerMinute"
            >
              <InputNumber min={1} max={10000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="В час"
              name="requestsPerHour"
            >
              <InputNumber min={1} max={100000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="В день"
              name="requestsPerDay"
            >
              <InputNumber min={1} max={1000000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="В месяц"
              name="requestsPerMonth"
            >
              <InputNumber min={1} max={10000000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Таймаут (сек)"
              name="timeout"
              rules={[{ required: true, message: 'Введите таймаут' }]}
            >
              <InputNumber min={1} max={300} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Задержка повтора (сек)"
              name="retryDelay"
              rules={[{ required: true, message: 'Введите задержку' }]}
            >
              <InputNumber min={1} max={3600} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Активен"
          name="isActive"
          valuePropName="checked"
        >
          <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              Отмена
            </Button>
            <Button type="primary" htmlType="submit">
              {editMode ? 'Сохранить' : 'Создать'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditModal;
