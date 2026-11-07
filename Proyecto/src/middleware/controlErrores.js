import winston from 'winston';
import { errorLogPath } from './logPaths.js';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: errorLogPath })
  ]
});

const controlErrores = (err, req, res, next) => {
  logger.error({
    mensaje: err.message,
    stack: err.stack,
    metodo: req.method,
    url: req.originalUrl
  });

  const estado = err.statusCode || 500;

  res.status(estado).json({
    mensaje: err.message || 'Error interno del servidor'
  });
};

export default controlErrores;