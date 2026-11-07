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

/**
 * @swagger
 * /formulario:
 *   get:
 *     summary: Muestra el formulario de captura
 *     tags: [Formulario]
 *     security: []
 *     responses:
 *       200:
 *         description: Página HTML del formulario
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/formulario', (req, res) => {
    res.render('formulario');
});

/**
 * @swagger
 * /formulario:
 *   post:
 *     summary: Valida y envía los datos del formulario
 *     tags: [Formulario]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Formulario'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Formulario'
 *     responses:
 *       200:
 *         description: Formulario enviado correctamente
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Datos inválidos; devuelve el formulario con errores
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
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
    const nombreUsuario = String(req.query.nombre || 'mundo');
    
    const datosPropios = {
        saludo: `¡Hola, ${nombreUsuario}! Que tengas un excelente día.`
    };

    const recursoHateoas = halson(datosPropios)
        .addLink('self', `/hateoas?nombre=${encodeURIComponent(nombreUsuario)}`)
        .addLink('inicio', '/')
        .addLink('saludo', `/saludo/${encodeURIComponent(nombreUsuario)}`)
        .addLink('pug', `/saludo/${encodeURIComponent(nombreUsuario)}/pug`);

    res.json(recursoHateoas);
}); 


/**
 * @swagger
 * /saludo/{nombre}:
 *   get:
 *     summary: Saluda a una persona por su nombre
 *     tags: [Saludo]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         example: Ana
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Saludo personalizado
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *             example: ¡Hola, Ana! Que tengas un excelente día.
 *       401:
 *         description: API key ausente o inválida
 */
router.get('/saludo/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    res.send(`¡Hola, ${nombreUsuario}! Que tengas un excelente día.`);
});

module.exports = router;
