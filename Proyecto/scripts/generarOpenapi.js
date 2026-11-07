import 'dotenv/config';
import { readFileSync } from 'node:fs';
import swaggerJsDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'node:url';

export function generarOpenapi() {
    const readme = readFileSync(
        fileURLToPath(new URL('../README.md', import.meta.url)),
        'utf8'
    );
    const descripcionSwagger = readme.match(
        /<!-- swagger-description:start -->([\s\S]*?)<!-- swagger-description:end -->/
    );

    if (!descripcionSwagger) {
        throw new Error('No se encontró la sección de portada Swagger en README.md');
    }

    const datosReadme = descripcionSwagger[1].trim();

    const opcionesJSDoc = {
        definition: {
            openapi: '3.0.3',
            info: {
                title: 'API REST de Gestión de Recetas',
                version: '1.0.0',
                description: datosReadme
            },
            servers: [{
                url: `https://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor local'
            }]
        },
        apis: [
            fileURLToPath(new URL('../src/router/recetasRouter.js', import.meta.url)),
            fileURLToPath(new URL('../src/index.js', import.meta.url))
        ]
    };

    return swaggerJsDoc(opcionesJSDoc);
}

const openapiSpec = generarOpenapi();

export default openapiSpec;
