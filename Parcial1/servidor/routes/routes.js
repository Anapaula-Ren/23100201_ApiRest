const express = require('express');
const router = express.Router();


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

router.get('/saludo/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    res.send(`¡Hola, ${nombreUsuario}! Que tengas un excelente día.`);
});

module.exports = router;