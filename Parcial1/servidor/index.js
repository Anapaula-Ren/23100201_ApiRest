const express = require('express');
const morgan = require('morgan');
const multer = require('multer'); // 1. Importar multer
const app = express();
const PORT = 3000;


app.use(express.json());

app.use(morgan((tokens, req, res) => {
    // Obtenemos la fecha y hora local actual bien formateada
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
        cb(null, 'uploads/'); // Carpeta donde se guardará
    },
    filename: (req, file, cb) => {
        // Le ponemos un nombre único combinando la fecha actual y el nombre original
        const nombreUnico = Date.now() + '-' + file.originalname;
        cb(null, nombreUnico);
    }
});

const upload = multer({ storage: storage });

const validarRutaPermitida = (req, res, next) => {
    const ruta = req.url;

  
    if (ruta === '/' || ruta.startsWith('/saludo')) {
        return next(); 
    }

    res.status(403).send(' Lo siento, esa no es la ruta correcta. debes poner /saludo/tu nombre');
};

app.post('/subir', upload.single('archivo'), (req, res) => {
    try {
        // Si no viene archivo, req.file vendrá indefinido
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        res.json({
            mensaje: '¡Archivo subido con éxito al servidor! 🚀',
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

app.use(validarRutaPermitida);
const miRuta= require('./routes/routes'); 

app.use ('/', miRuta); 

app.listen(PORT, () => {
    console.log(`Servidorsin express corriendo en http://localhost:${PORT}`);
});
