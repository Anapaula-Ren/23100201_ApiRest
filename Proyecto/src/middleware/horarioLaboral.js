/**
 * Middleware que permite continuar las peticiones de lunes a sábado,
 * de 06:00 a 19:59, según la hora local del servidor. Fuera de ese horario,
 * responde con estado 503.
 *
 * @function horarioLaboral
 * @param {Object} req Solicitud HTTP de Express.
 * @param {Object} res Respuesta HTTP de Express.
 * @param {Function} next Función para continuar al siguiente middleware.
 * @returns {Object|undefined} Respuesta 503 si está fuera del horario; de lo contrario, continúa.
 */

export const horarioLaboral = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }

    const fecha = new Date();
    const dia = fecha.getDay();
    const hora = fecha.getHours();

    const esDiaLaboral = dia >= 1 && dia <= 7;
    const estaEnHorario = hora >= 6 && hora < 20;

    if (!esDiaLaboral || !estaEnHorario) {
        return res.status(503).json({
            mensaje: 'No se pueden ejecutar peticiones a esta hora'
        });
    }

    next();
};