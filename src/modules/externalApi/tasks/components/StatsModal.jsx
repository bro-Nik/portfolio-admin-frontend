import React from 'react';
import { Modal, Divider, Card, Space, Descriptions, Tag, Button } from 'antd';
import {
  PlayCircleOutlined,
  DeleteOutlined,
  ApiOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { getTaskTypeTag, getStatusBadge } from '../utils';


const StatsModal = ({
  visible,
  selectedTask,
  onClose,
  handlers
}) => {

  if (!selectedTask) return null;

  return (
    <Modal
      title="Детали задачи"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Название" span={2}>
            {selectedTask.name}
          </Descriptions.Item>
          <Descriptions.Item label="Провайдер">
            <Tag icon={<ApiOutlined />} color="green">
              {selectedTask.apiProviderName}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Тип">
            {getTaskTypeTag(selectedTask.taskType)}
          </Descriptions.Item>
          <Descriptions.Item label="Статус">
            {getStatusBadge(selectedTask.isActive)}
          </Descriptions.Item>
          <Descriptions.Item label="Расписание">
            <Tag color="purple">{selectedTask.schedule}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Создана">
            {new Date(selectedTask.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Обновлена">
            {new Date(selectedTask.updatedAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Последний запуск" span={2}>
            {selectedTask.lastRun 
              ? new Date(selectedTask.lastRun).toLocaleString()
              : 'Никогда'}
          </Descriptions.Item>
          <Descriptions.Item label="Следующий запуск" span={2}>
            {selectedTask.nextRun 
              ? new Date(selectedTask.nextRun).toLocaleString()
              : 'Не запланирован'}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Параметры</Divider>
        <Card>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(selectedTask.parameters, null, 2)}
          </pre>
        </Card>

        <Divider orientation="left">Действия</Divider>
        <Space style={{ marginTop: '16px' }}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              handlers.handleRunTask(selectedTask.taskType, selectedTask.name);
              onClose();
            }}
          >
            Запустить сейчас
          </Button>
          <Button
            icon={<ScheduleOutlined />}
            onClick={() => {
              handlers.handleScheduleTask(selectedTask.id);
              onClose();
            }}
          >
            Перепланировать
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              handlers.handleDeleteTask(selectedTask.id);
              onClose();
            }}
          >
            Удалить
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default StatsModal;
