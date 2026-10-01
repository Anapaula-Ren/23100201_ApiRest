const jwt = require('jsonwebtoken');

const claveJwt = process.env.JWT_SECRET;

if (!claveJwt) {
    throw new Error('Configura JWT_SECRET en el archivo .env.');
}

const crearToken = (usuario) => jwt.sign(
    { usuario },
    claveJwt,
    { algorithm: 'HS256', expiresIn: '1h' }
);

const verificarToken = (req, res, next) => {
    const autorizacion = req.get('authorization');
    const token = autorizacion?.startsWith('Bearer ')
        ? autorizacion.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Se requiere un token Bearer.' });
    }

    try {
        req.usuario = jwt.verify(token, claveJwt, { algorithms: ['HS256'] });
        next();
    } catch {
        return res.status(401).json({ error: 'El token es inválido o expiró.' });
    }
};

module.exports = { crearToken, verificarToken };