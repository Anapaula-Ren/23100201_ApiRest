const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const manejadorErrores = require('./middlewares/errores');
// const authBasica = require('./middlewares/auth');
const morgan = require('morgan');
const multer = require('multer');
const app = express();


const PORT = 3000;
const apiKeyPermitida = process.env.API_KEY?.trim();

if (!apiKeyPermitida) {
    throw new Error('Configura API_KEY en el archivo .env.');
}

const validarApiKey = (req, res, next) => {
    if (req.path === '/formulario' && ['GET', 'POST'].includes(req.method)) {
        return next();
    }

    const apiKey = req.get('x-api-key');

    if (!apiKey || apiKey !== apiKeyPermitida) {
        return res.status(401).json({ error: 'API key ausente o inválida.' });
    }

    next();
};

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(authBasica);
app.use(validarApiKey);

app.use(morgan((tokens, req, res) => {
    //obtenr fecha
    const horaLocal = new Date().toLocaleString(); 

    return [
        `[${horaLocal}]`, 
        tokens.method(req, res), 
        tokens.url(req, res), 
        tokens.status(req, res), 
        '-', 
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        
        const nombreUnico = Date.now() + '-' + file.originalname;
        cb(null, nombreUnico);
    }
});

const upload = multer({ storage: storage });

app.post('/subir', upload.single('archivo'), (req, res) => {
    try {
        
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        res.json({
            mensaje: '¡Archivo subido con éxito al servidor! ',
            detallesDelArchivo: {
                nombreOriginal: req.file.originalname,
                nombreGuardado: req.file.filename,
                ruta: req.file.path,
                tamanioBytes: req.file.size
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al subir el archivo' });
    }
});


const miRuta= require('./routes/routes'); 

app.use ('/', miRuta); 


app.use((req, res, next) => {
    const error = new Error(`La ruta ${req.originalUrl} no existe en este servidor.`);
    error.statusCode = 404;
    next(error); // Salta directo al manejador centralizado
});

app.use(manejadorErrores);

app.listen(PORT, () => {
    console.log(`Servidorsin express corriendo en http://localhost:${PORT}`);
});
