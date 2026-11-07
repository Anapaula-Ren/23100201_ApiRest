/**
 * Crea un middleware que protege rutas mediante el encabezado `x-api-key`.
 *
 * @param {string} apiKeyPermitida Clave configurada para acceder a las rutas protegidas.
 * @returns {Function} Middleware de autenticación.
 * @throws {Error} Si no se configuró la API key.
 */
export function crearApiKeyMiddleware(apiKeyPermitida) {
	if (!apiKeyPermitida) {
		throw new Error('Configura API_KEY en el archivo .env.');
	}

	return (req, res, next) => {
		const apiKey = req.get('x-api-key');

		if (!apiKey || apiKey !== apiKeyPermitida) {
			return res.status(401).json({
				exito: false,
				error: {
					codigo: 401,
					estado: 'No autorizado (Unauthorized)',
					mensaje: 'API key ausente o inválida.'
				}
			});
		}

		next();
	};
}
