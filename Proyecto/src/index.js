import express from 'express';
import https from 'https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import recetasRouter from './router/recetasRouter.js';
import swaggerRouter from './documentation/swaggerRouter.js';
import { registrarAcceso } from './middleware/logDeAccesos.js';
import { guardarMetadata, upload } from './middleware/subirArchivos.js';
import controlErrores from './middleware/controlErrores.js';
import { crearApiKeyMiddleware } from './middleware/apiKeyMiddleware.js';
import 'dotenv/config';
import fs from 'fs';

const apiKeyPermitida = process.env.API_KEY?.trim();
const apiKeyMiddleware = crearApiKeyMiddleware(apiKeyPermitida);
const app = express();

// Estos son middlewares de aplicación que se ejecuta antes de las rutas
app.use(express.json());

// Documentación de la API
app.use('/api-docs', swaggerRouter);
app.use('/uploads', express.static('uploads'));
app.use(registrarAcceso);

// Vistas
app.set('view engine', 'pug');
app.set('views', fileURLToPath(new URL('./views', import.meta.url)));

app.get('/', (req, res) => {
    res.render('hola', 
        {   
            titulo: 'API REST de Recetas',
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