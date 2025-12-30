import React from 'react';
import { Space, Tag, Button, Tooltip, Progress, Popconfirm } from 'antd';
import {
  ApiOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { getStatusTag, getUtilizationColor } from '../utils'

export const columns = (handlers) => [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => (
      <Space>
        <ApiOutlined style={{ color: '#1890ff' }} />
        <strong>{name}</strong>
        {getStatusTag(record.isActive)}
      </Space>
    )
  },
  {
    title: 'Базовая URL',
    dataIndex: 'baseUrl',
    key: 'baseUrl',
    render: (url) => (
      <Tooltip title={url}>
        <span style={{ maxWidth: '200px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {url}
        </span>
      </Tooltip>
    )
  },
  {
    title: 'Лимиты',
    key: 'limits',
    render: (_, record) => (
      <Space direction="vertical" size="small">
        <span>
          {record.requestsPerMinute && <Tag color="blue">{record.requestsPerMinute}/мин</Tag>}
          {record.requestsPerHour && <Tag color="green">{record.requestsPerHour}/час</Tag>}
        </span>
        <span>
          {record.requestsPerDay && <Tag color="orange">{record.requestsPerDay}/день</Tag>}
          {record.requestsPerMonth && <Tag color="red">{record.requestsPerMonth}/мес</Tag>}
        </span>
      </Space>
    )
  },
  {
    title: 'Использование',
    key: 'usage',
    render: (_, record) => {
      const dayPercent = record.requestsPerDay ? Math.min((record.dayCounter / record.requestsPerDay) * 100, 100) : 0;
      const monthPercent = record.requestsPerMonth ? Math.min((record.monthCounter / record.requestsPerMonth) * 100, 100) : 0;
      
      return (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#666' }}>День:</span>
            <Progress 
              percent={Math.round(dayPercent)} 
              size="small" 
              strokeColor={getUtilizationColor(dayPercent)}
              format={percent => `${record.dayCounter}${record.requestsPerDay ? '/' + record.requestsPerDay : ''}`}
            />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#666' }}>Месяц:</span>
            <Progress 
              percent={Math.round(monthPercent)} 
              size="small" 
              strokeColor={getUtilizationColor(monthPercent)}
              format={percent => `${record.monthCounter}${record.requestsPerMonth ? '/' + record.requestsPerMonth : ''}`}
            />
          </div>
        </Space>
      );
    }
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Tooltip title="Подробности">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlers.showProviderDetails(record)}
          />
        </Tooltip>
        <Tooltip title="Редактировать">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handlers.handleEditProvider(record)}
          />
        </Tooltip>
        <Tooltip title="Сбросить счетчики">
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => handlers.handleResetCounters(record.id)}
          />
        </Tooltip>
        <Popconfirm
          title="Удалить API провайдера?"
          description="Все задачи, использующие этот провайдер, будут остановлены"
          onConfirm={() => handlers.handleDeleteProvider(record.id)}
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
