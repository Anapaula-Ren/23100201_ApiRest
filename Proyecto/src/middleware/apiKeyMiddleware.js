export function apiKeyMiddleware(req, res, next) {
	const providedApiKey = req.get('x-api-key');
	const configuredApiKey = process.env.API_KEY;

	if (!configuredApiKey || providedApiKey !== configuredApiKey) {
		return res
			.status(401)
			.json({ mensaje: 'API key inválida o faltante' });
	}

	next();
}
