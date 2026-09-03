const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;


app.use(express.json());

app.use(morgan((tokens, req, res) => {
    // Obtenemos la fecha y hora local actual bien formateada
    const horaLocal = new Date().toLocaleString(); 

    return [
        `[${horaLocal}]`, 
        tokens.method(req, res), 
        tokens.url(req, res), 
        tokens.status(req, res), 
        '-', 
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
}));

const validarRutaPermitida = (req, res, next) => {
    const ruta = req.url;

  
    if (ruta === '/' || ruta.startsWith('/saludo')) {
        return next(); 
    }

    res.status(403).send(' Lo siento, esa no es la ruta correcta. debes poner /saludo/tu nombre');
};


app.use(validarRutaPermitida);
const miRuta= require('./routes/routes'); 

app.use ('/', miRuta); 

app.listen(PORT, () => {
    console.log(`Servidorsin express corriendo en http://localhost:${PORT}`);
});
