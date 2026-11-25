import express from 'express';
import halson from 'halson';
import pool from '../db.js';
import { validarReceta } from '../middleware/validarMiddleware.js';

const router = express.Router();

const normalizarFila = fila => ({
    id: fila.id,
    nombre: fila.nombre,
    categoria: fila.categoria,
    tiempoPreparacion: fila.tiempoPreparacion,
    ingredientes: typeof fila.ingredientes === 'string' ? JSON.parse(fila.ingredientes) : fila.ingredientes,
    pasos: typeof fila.pasos === 'string' ? JSON.parse(fila.pasos) : fila.pasos,
    imagenUrl: fila.imagenUrl ?? null
});

const crearRecurso = (req, fila) => {
    const receta = normalizarFila(fila);
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
router.get('/', async (req, res, next) => {
    try {
        const { error, value } = validarReceta.query.validate(req.query, {
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({
                mensaje: 'Los filtros de recetas no son válidos',
                detalles: error.details.map(detalle => detalle.message)
            });
        }

        const condiciones = [];
        const parametros = [];

        if (value.nombre) {
            condiciones.push('LOWER(nombre) LIKE ?');
            parametros.push(`%${value.nombre.toLocaleLowerCase()}%`);
        }

        if (value.categoria) {
            condiciones.push('LOWER(categoria) = ?');
            parametros.push(value.categoria.toLocaleLowerCase());
        }

        if (value.tiempoMax !== undefined) {
            condiciones.push('tiempoPreparacion <= ?');
            parametros.push(value.tiempoMax);
        }

        const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
        const [filas] = await pool.query(`SELECT * FROM recetas ${whereClause}`, parametros);

        res.json(filas.map(fila => crearRecurso(req, fila)));
    } catch (err) {
        next(err);
    }
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
router.post('/', validarReceta.body, async (req, res, next) => {
    try {
        const { nombre, categoria, tiempoPreparacion, ingredientes, pasos, imagenUrl } = req.body;

        const [resultado] = await pool.query(
            `INSERT INTO recetas (nombre, categoria, tiempoPreparacion, ingredientes, pasos, imagenUrl)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                categoria,
                tiempoPreparacion,
                JSON.stringify(ingredientes),
                JSON.stringify(pasos),
                imagenUrl || null
            ]
        );

        const [filas] = await pool.query('SELECT * FROM recetas WHERE id = ?', [resultado.insertId]);
        res.status(201).json(crearRecurso(req, filas[0]));
    } catch (err) {
        next(err);
    }
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
router.get('/:id', obtenerId, async (req, res, next) => {
    try {
        const [filas] = await pool.query('SELECT * FROM recetas WHERE id = ?', [req.recetaId]);

        if (filas.length === 0) {
            const error = new Error('Receta no encontrada');
            error.statusCode = 404;
            return next(error);
        }

        res.json(crearRecurso(req, filas[0]));
    } catch (err) {
        next(err);
    }
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
router.put('/:id', obtenerId, validarReceta.body, async (req, res, next) => {
    try {
        const [existentes] = await pool.query('SELECT * FROM recetas WHERE id = ?', [req.recetaId]);

        if (existentes.length === 0) {
            const error = new Error('Receta no encontrada');
            error.statusCode = 404;
            return next(error);
        }

        const { nombre, categoria, tiempoPreparacion, ingredientes, pasos, imagenUrl } = req.body;
        const imagenFinal = imagenUrl || existentes[0].imagenUrl;

        await pool.query(
            `UPDATE recetas
             SET nombre = ?, categoria = ?, tiempoPreparacion = ?, ingredientes = ?, pasos = ?, imagenUrl = ?
             WHERE id = ?`,
            [
                nombre,
                categoria,
                tiempoPreparacion,
                JSON.stringify(ingredientes),
                JSON.stringify(pasos),
                imagenFinal,
                req.recetaId
            ]
        );

        const [actualizada] = await pool.query('SELECT * FROM recetas WHERE id = ?', [req.recetaId]);
        res.json(crearRecurso(req, actualizada[0]));
    } catch (err) {
        next(err);
    }
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
 *           example: [ "1 taza de caldo", "1 cebolla", "2 dientes de ajo" ]*/

export default router;