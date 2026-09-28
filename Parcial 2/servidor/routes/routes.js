const express = require('express');
const router = express.Router();
const halson = require('halson');

router.get('/', (req, res) => {
    res.send('Hola escribe "/saludo/tu nombre" pa darte un saludin especial');
});

router.get('/saludo/:nombre/pug', (req, res) => {
    const nombreUsuario = req.params.nombre;

    res.render('index', {
        titulo: 'Saludo Especial',
        mensaje: `¡Hola, ${nombreUsuario}! Que tengas un Pugcelente día.`
    });
});

// 1. RUTA DE HATEOAS (Cierra bien su llave antes de la siguiente)
router.get('/hateoas', (req, res) => {
    const nombreUsuario = req.params.nombre;
    
    const datosPropios = {
        saludo: `¡Hola, ${nombreUsuario}! Que tengas un excelente día.`
    };

    const recursoHateoas = halson(datosPropios)
        .addLink('self', `/saludo/${nombreUsuario}/hateoas`)
        .addLink('inicio', '/')
        .addLink('saludo', `/saludo/${nombreUsuario}`)
        .addLink('pug', `/saludo/${nombreUsuario}/pug`);

    res.json(recursoHateoas);
}); // <--- AQUÍ SE CIERRA BIEN LA FUNCIÓN DE HATEOAS

// 2. RUTA GENERAL DE SALUDO (Independiente y afuera)
router.get('/saludo/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    res.send(`¡Hola, ${nombreUsuario}! Que tengas un excelente día.`);
});

module.exports = router;