import 'dotenv/config';
import swaggerJsDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'node:url';

export function generarOpenapi() {
    const opcionesJSDoc = {
        definition: {
            openapi: '3.0.3',
            info: {
                title: 'API REST de Gestión de Recetas',
                version: '1.0.0',
                description: 'API para consultar, filtrar y administrar recetas.'
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
