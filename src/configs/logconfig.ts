import { transports, format } from 'winston';

export const loggerConfig = {
  levels: {
    critical_error: 0,
    error: 1,
    special_warning: 2,
    another_log_level: 3,
    info: 4,
  },
  transports: [
    new transports.Console({ format: format.simple() }),
    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};
