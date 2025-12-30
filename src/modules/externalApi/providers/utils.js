import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export const getStatusTag = (isActive) => {
  return isActive ? (
    <Tag icon={<CheckCircleOutlined />} color="success">
      Активен
    </Tag>
  ) : (
    <Tag icon={<CloseCircleOutlined />} color="error">
      Неактивен
    </Tag>
  );
};

export const getUtilizationColor = (percent) => {
  if (percent < 50) return '#52c41a';
  if (percent < 80) return '#faad14';
  return '#ff4d4f';
};

export const calculateUtilizationPercent = (counter, limit) => {
  return limit > 0 ? Math.min((counter / limit) * 100, 100) : 0;
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};
