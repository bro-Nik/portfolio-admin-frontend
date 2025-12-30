import React from 'react';
import { Modal, Tabs, Row, Col, Card, Statistic, Progress, Space, Descriptions, Tag, Timeline, Alert, Button } from 'antd';
import {
  ApiOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { getStatusTag } from '../utils';

const { TabPane } = Tabs;

const StatsModal = ({
  visible,
  selectedProvider,
  providerStats,
  providerLogs,
  onClose,
  onResetCounters
}) => {

  if (!selectedProvider || !providerStats) return null;

  return (
    <Modal
      title={
        <Space>
          <ApiOutlined />
          <span>Статистика API провайдера: {selectedProvider.name}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Tabs defaultActiveKey="stats">
        <TabPane tab="Статистика" key="stats" icon={<BarChartOutlined />}>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Запросов сегодня"
                  value={providerStats.requestsToday}
                  prefix={<ThunderboltOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Успешных"
                  value={providerStats.successfulToday}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Ошибок"
                  value={providerStats.failedToday}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Использование лимитов" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.entries(providerStats.utilizationPercent || {}).map(([key, percent]) => (
                <div key={key}>
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)} лимит:</span>
                  <Progress 
                    percent={Math.round(percent)}
                    status={percent > 80 ? 'exception' : 'normal'}
                    format={() => {
                      const counter = providerStats[`${key}Counter`];
                      const limit = providerStats[`${key}Limit`];
                      return `${counter}/${limit}`;
                    }}
                  />
                </div>
              ))}
            </Space>
          </Card>

          <Card title="Общая информация" size="small" style={{ marginTop: '16px' }}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Среднее время ответа">
                {providerStats.avgResponseTime ? 
                  `${providerStats.avgResponseTime.toFixed(2)}с` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="В очереди">
                {providerStats.pendingInQueue} запросов
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => onResetCounters(selectedProvider.id)}
            >
              Сбросить все счетчики
            </Button>
          </div>
        </TabPane>

        <TabPane tab="История запросов" key="logs" icon={<HistoryOutlined />}>
          {providerLogs.length === 0 ? (
            <Alert
              message="Нет данных"
              description="За последние 24 часа не было запросов"
              type="info"
              showIcon
            />
          ) : (
            <Timeline>
              {providerLogs.map((log, index) => (
                <Timeline.Item
                  key={log.id}
                  color={log.wasSuccessful ? "green" : "red"}
                  dot={index === 0 ? <ClockCircleOutlined /> : null}
                >
                  <Space direction="vertical" size={0}>
                    <div>
                      <strong>{log.endpoint}</strong>
                      <Tag color={log.wasSuccessful ? "success" : "error"} style={{ marginLeft: '8px' }}>
                        {log.statusCode || 'ERROR'}
                      </Tag>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <Tag style={{ marginLeft: '8px', fontSize: '12px' }}>
                        {log.responseTime?.toFixed(2)}с
                      </Tag>
                    </div>
                    {log.errorMessage && (
                      <Alert
                        message={log.errorMessage}
                        type="error"
                        size="small"
                        style={{ marginTop: '4px' }}
                      />
                    )}
                  </Space>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </TabPane>

        <TabPane tab="Информация" key="info" icon={<SafetyOutlined />}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Название">
              {selectedProvider.name}
            </Descriptions.Item>
            <Descriptions.Item label="Базовый URL">
              {selectedProvider.baseUrl}
            </Descriptions.Item>
            <Descriptions.Item label="API Ключ">
              {selectedProvider.apiKey ? (
                <Tag color="green" icon={<KeyOutlined />}>
                  Настроен
                </Tag>
              ) : (
                <Tag color="orange">Не настроен</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Таймаут">
              {selectedProvider.timeout} секунд
            </Descriptions.Item>
            <Descriptions.Item label="Задержка повтора">
              {selectedProvider.retryDelay} секунд
            </Descriptions.Item>
            <Descriptions.Item label="Статус">
              {getStatusTag(selectedProvider.isActive)}
            </Descriptions.Item>
            <Descriptions.Item label="Создан">
              {new Date(selectedProvider.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Обновлен">
              {new Date(selectedProvider.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default StatsModal;
