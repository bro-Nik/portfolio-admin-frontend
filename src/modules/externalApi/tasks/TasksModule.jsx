import React, { useState, useEffect } from 'react';
import { tasksApi } from './api';
import { Card, Row, Col, Table, Button, Form, message, notification, Statistic } from 'antd';
import { PauseCircleOutlined, PlusOutlined, ReloadOutlined, CheckCircleOutlined, SyncOutlined, DatabaseOutlined } from '@ant-design/icons';
import StatsModal from './components/StatsModal';
import CreateEditModal from './components/CreateEditModal';
import { columns } from './components/TaskColumns';
import { taskTypes } from './constants'

const TasksModule = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await tasksApi.getTasks();
      setTasks(response.data);
      console.log(response.data)
      
      // Обновляем статистику
      const activeCount = response.data.filter(task => task.isActive).length;
      setStats({
        total: response.data.length,
        active: activeCount,
        inactive: response.data.length - activeCount
      });
    } catch (error) {
      message.error('Ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (values) => {
    try {
      const taskData = {
        ...values,
        parameters: JSON.parse(values.parameters || '{}')
      };
      console.log(taskData)
      await tasksApi.createTask(taskData);
      setModalVisible(false);
      form.resetFields();
      fetchTasks();
      notification.success({
        message: 'Задача создана',
        description: 'Новая задача успешно добавлена в планировщик'
      });
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось создать задачу'
      });
    }
  };

  const handleUpdateTask = async (values) => {
    try {
      const taskData = {
        ...values,
        parameters: JSON.parse(values.parameters || '{}')
      };
      console.log(taskData)
      await tasksApi.createTask(taskData);
      setModalVisible(false);
      form.resetFields();
      fetchTasks();
      notification.success({
        message: 'Задача создана',
        description: 'Новая задача успешно добавлена в планировщик'
      });
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось создать задачу'
      });
    }
  };

  const handleRunTask = async (taskType, taskId) => {
    const taskTypeObj = taskTypes.find(type => type.value === taskType);
    const taskName = taskTypeObj ? taskTypeObj.label : 'Неизвестная задача';

    try {
      console.log(taskName)
      console.log(taskType)
      const response = await tasksApi.runTask(taskId);
      notification.success({
        message: `Задача "${taskName}" запущена`,
        description: `ID задачи: ${response.data.taskId}`,
        duration: 4
      });
    } catch (error) {
      notification.error({
        message: 'Ошибка запуска',
        description: 'Не удалось запустить задачу'
      });
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await tasksApi.updateTask(taskId, { isActive: !currentStatus });
      fetchTasks();
      message.success(`Статус задачи изменен`);
    } catch (error) {
      message.error('Ошибка изменения статуса');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksApi.deleteTask(taskId);
      fetchTasks();
      notification.success({
        message: 'Задача удалена',
        description: 'Задача успешно удалена из системы'
      });
    } catch (error) {
      notification.error({
        message: 'Ошибка удаления',
        description: 'Не удалось удалить задачу'
      });
    }
  };

  const handleScheduleTask = async (taskId) => {
    try {
      result = await tasksApi.scheduleTask(taskId);
      notification.success({
        message: 'Расписание обновлено',
        description: 'Задача успешно запланирована'
      });
    } catch (error) {
      notification.error({
        message: 'Ошибка планирования',
        description: error?.message || 'Не удалось обновить расписание'
      });
    }
  };

  const showTaskDetails = (task) => {
    setSelectedTask(task);
    setViewModalVisible(true);
  };

  const tableColumns = columns({
    showTaskDetails,
    handleRunTask,
    handleToggleTask,
    handleScheduleTask,
    handleDeleteTask
  });

  const quickActions = [
    {
      key: 'update_prices',
      label: 'Обновить цены',
      description: 'Запустить обновление текущих цен',
      icon: <SyncOutlined />,
      action: () => handleRunTask('smart_price_update')
    },
    {
      key: 'update_tickers',
      label: 'Обновить тикеры',
      description: 'Запустить обновление тикеров',
      icon: <DatabaseOutlined />,
      action: () => handleRunTask('ticker_update')
    },

  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Статистика */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Всего задач"
              value={stats.total}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Активных"
              value={stats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Неактивных"
              value={stats.inactive}
              prefix={<PauseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Быстрые действия */}
      <Card 
        title="Быстрые действия" 
        style={{ marginBottom: '24px' }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Создать задачу
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col span={8} key={action.key}>
              <Card
                hoverable
                onClick={action.action}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '16px', color: '#1890ff' }}>
                  {action.icon}
                </div>
                <h4>{action.label}</h4>
                <p style={{ color: '#666', fontSize: '12px' }}>{action.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Таблица задач */}
      <Card
        title="Управление задачами"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchTasks}
            loading={loading}
          >
            Обновить
          </Button>
        }
      >
        <Table
          columns={tableColumns}
          dataSource={tasks}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Модальное окно создания задачи */}
      <CreateEditModal
        visible={modalVisible}
        selectedTask={selectedTask}
        onCancel={() => {
          setModalVisible(false);
          setSelectedTask(null);
        }}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
      />

      {/* Модальное окно просмотра задачи */}
      <StatsModal
        visible={viewModalVisible}
        selectedTask={selectedTask}
        onClose={() => setViewModalVisible(false)}
        handlers={{
          handleRunTask,
          handleScheduleTask,
          handleDeleteTask,
        }}
      />
    </div>
  );
};

export default TasksModule;
