import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import recetasRouter from './router/recetasRouter.js';
import swaggerRouter from './documentation/swaggerRouter.js';
import { registrarAcceso } from './middleware/logDeAccesos.js';
import { guardarMetadata, upload } from './middleware/subirArchivos.js';
import controlErrores from './middleware/controlErrores.js';
import { crearApiKeyMiddleware } from './middleware/apiKeyMiddleware.js';
import 'dotenv/config';

const apiKeyPermitida = process.env.API_KEY?.trim();
const apiKeyMiddleware = crearApiKeyMiddleware(apiKeyPermitida);
const app = express();

app.set('trust proxy', 1);
app.use(express.json());

// Documentación y archivos estáticos
app.use('/api-docs', swaggerRouter);
app.use('/uploads', express.static('uploads'));
app.use(registrarAcceso);

// Vistas
app.set('view engine', 'pug');
app.set('views', fileURLToPath(new URL('./views', import.meta.url)));

app.get('/', (req, res) => {
    res.render('hola', {
        titulo: 'API REST de Recetas',
        titulo1: '¡API de Recetas funcionando!',
        mensaje: 'Hecho por: Anapaula Rendón',
        titulo2: 'Rutas de consulta:',
        ruta1: 'GET /recetas'
    });
});

app.post('/subir', apiKeyMiddleware, upload.single('archivo'), (req, res) => {
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

app.use('/recetas', apiKeyMiddleware, recetasRouter);

app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

app.use(controlErrores);

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0', () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
    });
}

export default app;