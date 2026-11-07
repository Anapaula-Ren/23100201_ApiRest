import express from 'express';
import halson from 'halson';
import { validarReceta } from '../middleware/validarMiddleware.js';

const router = express.Router();

const recetas = [
    {
        id: 1,
        nombre: 'Pastel de chocolate',
        categoria: 'postres',
        tiempoPreparacion: 60,
        ingredientes: ['harina', 'azúcar', 'cacao', 'huevos', 'mantequilla'],
        pasos: ['Mezcla los ingredientes', 'Hornea durante 40 minutos'],
        imagenUrl: null
    },
    {
        id: 2,
        nombre: 'Agua de jamaica',
        categoria: 'bebidas',
        tiempoPreparacion: 20,
        ingredientes: ['flor de jamaica', 'agua', 'azúcar'],
        pasos: ['Hierve la flor', 'Cuela y endulza al gusto'],
        imagenUrl: null
    },
    {
        id: 3,
        nombre: 'Tacos de frijoles',
        categoria: 'platillos',
        tiempoPreparacion: 25,
        ingredientes: ['tortillas', 'frijoles', 'cebolla', 'cilantro'],
        pasos: ['Calienta los frijoles', 'Sirve en tortillas calientes'],
        imagenUrl: null
    }
];

const crearRecurso = (req, receta) => {
    const origen = `${req.protocol}://${req.get('host')}`;
    const recurso = halson(receta)
        .addLink('self', `${origen}${req.baseUrl}/${receta.id}`)
        .addLink(
            'categoria',
            `${origen}${req.baseUrl}?categoria=${encodeURIComponent(receta.categoria)}`
        );

    if (receta.imagenUrl) {
        const href = receta.imagenUrl.startsWith('/')
            ? `${origen}${receta.imagenUrl}`
            : receta.imagenUrl;
        recurso.addLink('imagen', href);
    }

    return recurso;
};

const obtenerId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        const error = new Error('El id de la receta debe ser un número entero positivo');
        error.statusCode = 400;
        return next(error);
    }

    req.recetaId = id;
    next();
};

/**
 * @swagger
 * /recetas:
 *   get:
 *     tags:
 *       - Recetas
 *     summary: Listar y filtrar recetas
 *     description: Filtra el catálogo por nombre parcial, categoría y tiempo máximo de preparación.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: nombre
 *         in: query
 *         schema:
 *           type: string
 *         description: Coincidencia parcial, sin distinguir mayúsculas.
 *         example: pastel
 *       - name: categoria
 *         in: query
 *         schema:
 *           type: string
 *         example: postres
 *       - name: tiempoMax
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Tiempo de preparación máximo en minutos.
 *         example: 30
 *     responses:
 *       '200':
 *         description: Recetas encontradas; devuelve una lista vacía si no hay coincidencias.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receta'
 *       '400':
 *         description: Parámetros de consulta inválidos.
 *       '401':
 *         description: API key inválida o faltante.
 */
router.get('/', (req, res) => {
    const { error, value } = validarReceta.query.validate(req.query, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            mensaje: 'Los filtros de recetas no son válidos',
            detalles: error.details.map(detalle => detalle.message)
        });
    }

    let resultado = recetas;

    if (value.nombre) {
        const nombre = value.nombre.toLocaleLowerCase();
        resultado = resultado.filter(
            receta => receta.nombre.toLocaleLowerCase().includes(nombre)
        );
    }

    if (value.categoria) {
        const categoria = value.categoria.toLocaleLowerCase();
        resultado = resultado.filter(
            receta => receta.categoria.toLocaleLowerCase() === categoria
        );
    }

    if (value.tiempoMax !== undefined) {
        resultado = resultado.filter(
            receta => receta.tiempoPreparacion <= value.tiempoMax
        );
    }

    res.json(resultado.map(receta => crearRecurso(req, receta)));
});

/**
 * @swagger
 * /recetas:
 *   post:
 *     tags:
 *       - Recetas
 *     summary: Crear una receta
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecetaEntrada'
 *     responses:
 *       '201':
 *         description: Receta creada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receta'
 *       '400':
 *         description: Cuerpo de petición inválido.
 *       '401':
 *         description: API key inválida o faltante.
 */
router.post('/', validarReceta.body, (req, res) => {
    const receta = {
        id: Math.max(0, ...recetas.map(item => item.id)) + 1,
        ...req.body,
        imagenUrl: req.body.imagenUrl || null
    };

    recetas.push(receta);

    res.status(201).json(crearRecurso(req, receta));
});

/**
 * @swagger
 * /recetas/{id}:
 *   get:
 *     tags:
 *       - Recetas
 *     summary: Buscar receta por ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Receta encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receta'
 *       '400':
 *         description: El ID no es válido.
 *       '404':
 *         description: Receta no encontrada.
 *       '401':
 *         description: API key inválida o faltante.
 */
router.get('/:id', obtenerId, (req, res, next) => {
    const receta = recetas.find(item => item.id === req.recetaId);

    if (!receta) {
        const error = new Error('Receta no encontrada');
        error.statusCode = 404;
        return next(error);
    }

    res.json(crearRecurso(req, receta));
});

/**
 * @swagger
 * /recetas/{id}:
 *   put:
 *     tags:
 *       - Recetas
 *     summary: Actualizar una receta
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecetaEntrada'
 *     responses:
 *       '200':
 *         description: Receta actualizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receta'
 *       '400':
 *         description: ID o cuerpo de petición inválido.
 *       '404':
 *         description: Receta no encontrada.
 *       '401':
 *         description: API key inválida o faltante.
 */
router.put('/:id', obtenerId, validarReceta.body, (req, res, next) => {
    const indice = recetas.findIndex(item => item.id === req.recetaId);

    if (indice === -1) {
        const error = new Error('Receta no encontrada');
        error.statusCode = 404;
        return next(error);
    }

    recetas[indice] = {
        id: req.recetaId,
        ...req.body,
        imagenUrl: req.body.imagenUrl || recetas[indice].imagenUrl
    };

    res.json(crearRecurso(req, recetas[indice]));
});

/**
 * @swagger
 * tags:
 *   - name: Recetas
 *     description: Consulta, filtrado y administración de recetas.
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *       description: Usa el valor configurado en la variable de entorno API_KEY.
 *   schemas:
 *     RecetaEntrada:
 *       type: object
 *       required:
 *         - nombre
 *         - categoria
 *         - tiempoPreparacion
 *         - ingredientes
 *         - pasos
 *       properties:
 *         nombre:
 *           type: string
 *           example: Sopa de verduras
 *         categoria:
 *           type: string
 *           example: platillos
 *         tiempoPreparacion:
 *           type: integer
 *           minimum: 1
 *           example: 35
 *         ingredientes:
 *           type: array
 *           items:
 *             type: string
 *           example: [zanahoria, papa, calabacita]
 *         pasos:
 *           type: array
 *           items:
 *             type: string
 *           example: [Lava y corta las verduras, Cuécelas hasta que estén suaves]
 *         imagenUrl:
 *           type: string
 *           nullable: true
 *           example: /uploads/sopa-verduras.jpg
 *     Receta:
 *       allOf:
 *         - $ref: '#/components/schemas/RecetaEntrada'
 *         - type: object
 *           required:
 *             - id
 *             - imagenUrl
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             imagenUrl:
 *               type: string
 *               nullable: true
 *             _links:
 *               type: object
 *               description: Enlaces HATEOAS self, categoria y, cuando existe, imagen.
 *     Error:
 *       type: object
 *       required:
 *         - mensaje
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Receta no encontrada
 */

export default router;
