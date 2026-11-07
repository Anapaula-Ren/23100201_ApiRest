function crearValidadorApiKey(apiKeyPermitida) {
    return (req, res, next) => {
        if (req.path === '/formulario' && ['GET', 'POST'].includes(req.method)) {
            return next();
        }

        const apiKey = req.get('x-api-key');

        if (!apiKey || apiKey !== apiKeyPermitida) {
            return res.status(401).json({ error: 'API key ausente o inválida.' });
        }

        next();
    };
}

module.exports = crearValidadorApiKey;
