const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;


app.use(express.json());

app.use(morgan('dev'));

const validarRutaPermitida = (req, res, next) => {
    const ruta = req.url;

    // Permitimos la ruta raíz '/' o cualquier ruta que empiece con '/saludo'
    if (ruta === '/' || ruta.startsWith('/saludo')) {
        return next(); // Todo bien, pase usted
    }

    // Si escribieron cualquier otra cosa (como /pene, /basura, /loquesea), bloqueamos
    res.status(403).send('🛑 ¡Acceso denegado! Palabra no permitida en la ruta.');
};

// Activamos el middleware para que filtre todo lo que entre
app.use(validarRutaPermitida);
const miRuta= require('./routes/routes'); 

app.use ('/', miRuta); 

app.listen(PORT, () => {
    console.log(`Servidorsin express corriendo en http://localhost:${PORT}`);
});
