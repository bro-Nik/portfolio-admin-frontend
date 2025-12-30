export const schedulePresets = [
  { value: '* * * * *', label: 'Каждую минуту' },
  { value: '*/5 * * * *', label: 'Каждые 5 минут' },
  { value: '*/15 * * * *', label: 'Каждые 15 минут' },
  { value: '0 * * * *', label: 'Каждый час' },
  { value: '0 */6 * * *', label: 'Каждые 6 часов' },
  { value: '0 0 * * *', label: 'Ежедневно' },
  { value: '0 0 * * 0', label: 'Еженедельно' }
];

export const taskTypes = [
  { value: 'smart_price_update', label: 'Обновление цен' },
  { value: 'update_tickers', label: 'Обновление тикеров' },
];
