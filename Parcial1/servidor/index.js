const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;


app.use(express.json());

app.use(morgan('dev'));

const validarRutaPermitida = (req, res, next) => {
    const ruta = req.url;

  
    if (ruta === '/' || ruta.startsWith('/saludo')) {
        return next(); 
    }

    res.status(403).send(' Lo siento, esa no es la ruta correcta');
};


app.use(validarRutaPermitida);
const miRuta= require('./routes/routes'); 

app.use ('/', miRuta); 

app.listen(PORT, () => {
    console.log(`Servidorsin express corriendo en http://localhost:${PORT}`);
});
