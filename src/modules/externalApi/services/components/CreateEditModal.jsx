import React from 'react';
import { Modal, Form, Input, InputNumber, Switch, Row, Col, Select, Divider, Space, Button } from 'antd';
import { ApiOutlined, LinkOutlined, KeyOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateEditModal = ({
  visible,
  selectedService,
  presets,
  onCancel,
  onCreate,
  onUpdate
}) => {
  const [form] = Form.useForm();
  const editMode = selectedService?.id;

  const initialValues = {
    requestsPerMinute: 30,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    requestsPerMonth: 30000,
    retryDelay: 60,
    timeout: 30,
    isActive: true
  };

  const loadPreset = (presetName) => {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
      form.setFieldsValue({
        name: preset.name,
        baseUrl: preset.baseUrl,
        requestsPerMinute: preset.requestsPerMinute,
        requestsPerHour: preset.requestsPerHour,
        requestsPerDay: preset.requestsPerDay,
        requestsPerMonth: preset.requestsPerMonth,
        timeout: preset.timeout,
        retryDelay: 60,
        isActive: true
      });
    }
  };

  const handleSubmit = (values) => {
    if (editMode && selectedService) {
      onUpdate(selectedService.id, values);
    } else {
      onCreate(values);
    }
  };

  return (
    <Modal
      title={editMode ? 'Редактировать API сервис' : 'Создать новый API сервис'}
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
        initialValues={editMode ? { ...selectedService, apiKey: selectedService?.apiKey ? '***' : '' } : initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Название сервиса"
              name="name"
              rules={[
                { required: true, message: 'Введите название' },
                { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Только буквы, цифры, _ и -' }
              ]}
            >
              <Input 
                placeholder="coingecko, binance, etc" 
                disabled={editMode}
                prefix={<ApiOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Пресеты"
              help="Выберите предустановку для популярных сервисов"
            >
              <Select
                placeholder="Выберите пресет"
                onChange={loadPreset}
                allowClear
              >
                {presets.map(preset => (
                  <Option key={preset.name} value={preset.name}>
                    {preset.displayName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Базовый URL"
          name="baseUrl"
          rules={[
            { required: true, message: 'Введите URL' },
            { type: 'url', message: 'Введите корректный URL' }
          ]}
        >
          <Input 
            placeholder="https://api.example.com/v1" 
            prefix={<LinkOutlined />}
          />
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
