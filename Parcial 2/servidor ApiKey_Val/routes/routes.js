const express = require('express');
const router = express.Router();
const halson = require('halson');
const Joi = require('joi');

const esquemaFormulario = Joi.object({
    nombre: Joi.string().required(),
    edad: Joi.number().required()
});

router.get('/', (req, res) => {
    res.send('Hola escribe "/saludo/tu nombre" pa darte un saludin especial');
});

router.get('/formulario', (req, res) => {
    res.render('formulario');
});

router.post('/formulario', (req, res) => {
    const { error } = esquemaFormulario.validate(req.body, { abortEarly: false });

    if (error) {
        const errores = error.details.map(detalle => ({ msg: detalle.message }));
        return res.status(400).render('formulario', { errores });
    }

    res.send('Formulario enviado correctamente.');
});

router.get('/saludo/:nombre/pug', (req, res) => {
    const nombreUsuario = req.params.nombre;

    res.render('index', {
        titulo: 'Saludo Especial',
        mensaje: `¡Hola, ${nombreUsuario}! Que tengas un Pugcelente día.`
    });
});


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
}); 


router.get('/saludo/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    res.send(`¡Hola, ${nombreUsuario}! Que tengas un excelente día.`);
});

module.exports = router;
