import multer from 'multer';
import path from 'path';
import fs from 'fs';

const metadataPath = './metadata.json';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, callback) => {
        callback(null, path.basename(file.originalname));
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
            const error = new Error('Solo se permiten imágenes');
            error.statusCode = 400;
            return callback(error);
        }

        callback(null, true);
    }
});

const obtenerFechaLocal = () => new Date().toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'medium'
});

const guardarMetadata = archivo => {
    let archivos = [];

    if (fs.existsSync(metadataPath)) {
        const contenido = fs.readFileSync(metadataPath, 'utf8');
        archivos = contenido ? JSON.parse(contenido) : [];
    }

    archivos.push({
        nombre: archivo.filename,
        tipo: archivo.mimetype,
        tamaño: archivo.size,
        fechaSubida: obtenerFechaLocal(),
    });

    fs.writeFileSync(metadataPath, JSON.stringify(archivos, null, 2));
};

export { guardarMetadata, upload };
