const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hola escribe "/saludo/tu nombre" pa darte un saludin especial');
});


router.get('/saludo/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    res.send(`¡Hola, ${nombreUsuario}! Que tengas un excelente día.`);
});

router.post('/saludo', (req, res) => {
    // Extraemos los datos que vienen en el cuerpo (body) de la petición
    const { nombre, mensaje } = req.body;

    res.json({
        estado: '¡Éxito! ',
        respuesta: `Hola ${nombre}, tu mensaje fue recibido correctamente.`,
        tuMensaje: mensaje
    });
});

module.exports = router;