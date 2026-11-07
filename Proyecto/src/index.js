import express from 'express';
import https from 'https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import recetasRouter from './router/recetasRouter.js';
import swaggerRouter from './documentation/swaggerRouter.js';
import rapidocRouter from './documentation/rapidocRouter.js';
import openapiRouter from './documentation/openapiRouter.js';
import { horarioLaboral } from './middleware/horarioLaboral.js';
import { accesos, morgan } from './middleware/logDeAccesos.js';
import { guardarMetadata, upload } from './middleware/subirArchivos.js';
import controlErrores from './middleware/controlErrores.js';
import { apiKeyMiddleware } from './middleware/apiKeyMiddleware.js';
import 'dotenv/config';
import fs from 'fs';

const app = express();

// Estos son middlewares de aplicación que se ejecuta antes de las rutas
app.use(express.json());
app.use(
    '/swagger-assets',
    express.static(fileURLToPath(new URL('./assets', import.meta.url)))
);

// Documentación de la API
app.use('/api-docs', swaggerRouter);
app.use('/api-reference', rapidocRouter);
app.use('/api-spec', openapiRouter);
app.use(
    '/jsdoc',
    express.static(fileURLToPath(new URL('../docs', import.meta.url)))
);
app.use('/uploads', express.static('uploads'));
app.use(morgan(':remote-addr - :remote-user [:local-date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: accesos }));
app.use(horarioLaboral);

// Vistas
app.set('view engine', 'pug');
app.set('views', './src/views');

app.get('/', (req, res) => {
    res.render('hola', 
        {   
            titulo1: '¡API de Recetas funcionando!', 
            mensaje: 'Hecho por: Anapaula Rendón',
            titulo2: 'Rutas de consulta:',
            ruta1: 'GET /recetas',
        });
});

/**
 * @swagger
 * /subir:
 *   post:
 *     tags:
 *       - Imágenes
 *     summary: Subir una imagen de receta
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - archivo
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Imagen guardada en uploads.
 *       '400':
 *         description: No se envió un archivo.
 *       '401':
 *         description: API key inválida o faltante.
 */
app.post("/subir", apiKeyMiddleware, upload.single("archivo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            mensaje: 'Debes enviar un archivo con el campo "archivo"'
        });
    }

    guardarMetadata(req.file);

    res.json({
        mensaje: 'Imagen recibida',
        nombre: req.file.filename,
        imagenUrl: `/uploads/${encodeURIComponent(req.file.filename)}`
    });
});

/**
 * @swagger
 * /uploads/{nombre}:
 *   get:
 *     tags:
 *       - Imágenes
 *     summary: Obtener una imagen subida
 *     parameters:
 *       - name: nombre
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Archivo de imagen.
 *       '404':
 *         description: Imagen no encontrada.
 */

// Aquí se invocan las rutas
app.use('/recetas', apiKeyMiddleware, recetasRouter);

app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

app.use(controlErrores);

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const port = process.env.PORT || 3000;
    const options = {
        key: fs.readFileSync('./ssl/server.key'),
        cert: fs.readFileSync('./ssl/server.crt')
    };

    https.createServer(options, app).listen(port, () => {
        console.log(`Servidor escuchando en https://localhost:${port}`);
    });
}

export default app;