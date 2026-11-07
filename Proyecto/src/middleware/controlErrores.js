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

const mensajesEstadoHTTP = {
    400: 'Solicitud incorrecta (Bad Request)',
    401: 'No autorizado (Unauthorized)',
    403: 'Prohibido (Forbidden)',
    404: 'No encontrado (Not Found)',
    500: 'Error interno del servidor (Internal Server Error)'
};

const controlErrores = (err, req, res, next) => {
    const estado = err.statusCode || 500;
    const significadoHTTP = mensajesEstadoHTTP[estado] || 'Error desconocido';
    const mensaje = err.message || 'Ocurrió un error inesperado en el servidor';

    logger.error({
        metodo: req.method,
        ruta: req.originalUrl,
        usuarioIP: req.ip,
        codigo: estado,
        descripcion: significadoHTTP,
        detalle: mensaje,
        stack: err.stack
    });

    res.status(estado);

    const aceptaHTML = req.get('accept')?.includes('text/html');
    const esEndpointApi = req.path === '/subir'
        || req.path.startsWith('/recetas');

    if (aceptaHTML && !esEndpointApi) {
        return res.render('errores', {
            codigo: estado,
            estado: significadoHTTP,
            mensaje
        });
    }

    return res.json({
        exito: false,
        error: {
            codigo: estado,
            estado: significadoHTTP,
            mensaje
        }
    });
};

export default controlErrores;