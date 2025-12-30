import React from 'react';
import { Space, Tag, Button, Tooltip, Popconfirm, Switch, } from 'antd';
import {
  ApiOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { getTaskTypeTag, getStatusBadge } from '../utils';
import { schedulePresets } from '../constants'

const utcToLocal = (utcDateString) => {
  // Добавляем 'Z' в конец, если его нет
  const dateStringWithZ = utcDateString.endsWith('Z') ? utcDateString : utcDateString + 'Z';
  return new Date(dateStringWithZ).toLocaleString();
};

export const columns = (handlers) => [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Button type="link" onClick={() => handlers.showTaskDetails(record)}>
        {text}
      </Button>
    )
  },
  {
    title: 'Провайдер',
    dataIndex: 'apiProviderName',
    key: 'apiProviderName',
    render: (providerName) => <Tag icon={<ApiOutlined />} color="green">{providerName}</Tag>
  },
  {
    title: 'Тип задачи',
    dataIndex: 'taskType',
    key: 'taskType',
    render: (type) => getTaskTypeTag(type)
  },
  {
    title: 'Расписание',
    dataIndex: 'schedule',
    key: 'schedule',
    render: (schedule) => (
      <Tooltip title={schedule}>
        <Tag icon={<ScheduleOutlined />} color="purple">
          {schedulePresets.find(p => p.value === schedule)?.label || schedule}
        </Tag>
      </Tooltip>
    )
  },
  {
    title: 'Активность',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (status) => getStatusBadge(status)
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status) => status
  },
  {
    title: 'Последний запуск',
    dataIndex: 'lastRun',
    key: 'lastRun',
    render: (date) => date ? utcToLocal(date) : 'Никогда'
    
  },
  {
    title: 'Следующий запуск',
    dataIndex: 'nextRun',
    key: 'nextRun',
    render: (date) => date ? utcToLocal(date) : 'Не запланирован'
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (_, record) => (
      <Space size="small">
        <Tooltip title="Запустить сейчас">
          <Button
            type="primary"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handlers.handleRunTask(record.taskType, record.id)}
          />
        </Tooltip>
        
        <Tooltip title={record.isActive ? 'Остановить' : 'Активировать'}>
          <Switch
            size="small"
            checked={record.isActive}
            onChange={() => handlers.handleToggleTask(record.id, record.isActive)}
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren={<CloseCircleOutlined />}
          />
        </Tooltip>
        
        <Tooltip title="Перепланировать">
          <Button
            size="small"
            icon={<ScheduleOutlined />}
            onClick={() => handlers.handleScheduleTask(record.id)}
          />
        </Tooltip>
        
        <Popconfirm
          title="Удалить задачу?"
          description="Вы уверены, что хотите удалить эту задачу?"
          onConfirm={() => handlers.handleDeleteTask(record.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Tooltip title="Удалить">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Popconfirm>
      </Space>
    )
  }
];
