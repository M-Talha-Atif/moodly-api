import morgan from 'morgan';
import { Logger } from 'winston';

export const morganToWinston = (logger: Logger) =>
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (msg: string) => logger.info(msg.trim(), { label: 'http' }),
    },
  });
