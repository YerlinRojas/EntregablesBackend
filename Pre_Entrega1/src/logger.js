import winston from 'winston'
import config from './config/config.js';

//Winston
// niveles de sistema
const logLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  };

  const colors = {
    debug: 'white',
    http: 'magenta',
    info: 'green',
    warning: 'yellow',
    error: 'red',
    fatal: 'orange'
  };

  winston.addColors(colors);

  //formato
  const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  )
  
  // Configuración para el logger de desarrollo
 const developmentLogger = winston.createLogger({
  levels: logLevels,
  format,
  transports: [
    new winston.transports.Console({ level: 'fatal' }), // Log en consola a partir de nivel 'debug'
  ],
  });
  
  // Configuración para el logger de producción
   const productionLogger = winston.createLogger({
    levels: logLevels,
    format,
    transports: [
      new winston.transports.File({ filename: 'errors.log', level: 'error' }), // Log en archivo a partir de nivel 'error'
    ],
  });
  
  //entorno
  export const logger = config.NODE_ENV === 'production' ? productionLogger : developmentLogger
  
  



