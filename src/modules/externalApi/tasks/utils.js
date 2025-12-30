import { Tag, Badge } from 'antd';
import { taskTypes } from './constants'

export const getTaskTypeTag = (type) => {
  const taskType = taskTypes.find(t => t.value === type);
  return taskType ? (
    <Tag icon={taskType.icon} color="blue">
      {taskType.label}
    </Tag>
  ) : (
    <Tag color="default">{type}</Tag>
  );
};

export const getStatusBadge = (status) => {
  return status ? (
    <Badge status="success" text="Активна" />
  ) : (
    <Badge status="error" text="Неактивна" />
  );
};
