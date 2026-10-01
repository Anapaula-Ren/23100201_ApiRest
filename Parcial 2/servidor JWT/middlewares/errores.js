const winston = require('winston');

// 1. Diccionario de significados de códigos HTTP para que sea muy descriptivo
const mensajesEstadoHTTP = {
    400: 'Solicitud incorrecta (Bad Request)',
    401: 'No autorizado (Unauthorized)',
    403: 'Prohibido (Forbidden)',
    404: 'No encontrado (Not Found)',
    500: 'Error interno del servidor (Internal Server Error)',
    503: 'Servicio no disponible (Service Unavailable)'
};

// 2. Winston configurado para guardar en un archivo .txt con hora y qué pasó
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs_errores.txt' })
    ]
});

// 3. El manejador global de errores (la función de 4 parámetros)
const manejadorErrores = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const significadoHTTP = mensajesEstadoHTTP[statusCode] || 'Error desconocido';
    const mensaje = err.message || 'Ocurrió un error inesperado en el servidor';

    // Registramos en el archivo .txt qué pasó, a qué hora, ruta y método
    logger.error({
        fechaHora: new Date().toISOString(),
        metodo: req.method,
        ruta: req.originalUrl,
        usuarioIP: req.ip,
        codigo: statusCode,
        descripcion: significadoHTTP,
        detalle: mensaje
    });

    if (statusCode === 404) {
        return res.status(404).render('errores', {
            codigo: 404,
            estado: 'No encontrado (Not Found)',
            mensaje: mensaje
        });
    }

    // Respuesta estándar limpia (sin datos sensibles)
    return res.status(statusCode).json({
        exito: false,
        error: {
            codigo: statusCode,
            estado: significadoHTTP,
            mensaje: mensaje
        }
    });
};

module.exports = manejadorErrores;