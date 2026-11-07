const path = require('path');
const fs = require('fs');
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { apiReference } = require('@scalar/express-api-reference');

const descripcion = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');

const opcionesSwagger = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST - API Key',
            version: '1.0.0',
            description: descripcion
        },
        servers: [{ url: '/' }],
        tags: [
            { name: 'Formulario', description: 'Visualización y validación del formulario.' },
            { name: 'Saludo', description: 'Saludo personalizado con parámetro de ruta.' }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key'
                }
            },
            schemas: {
                Formulario: {
                    type: 'object',
                    required: ['nombre', 'edad'],
                    properties: {
                        nombre: {
                            type: 'string',
                            example: 'Ana'
                        },
                        edad: {
                            type: 'number',
                            example: 20
                        }
                    }
                }
            }
        }
    },
    apis: [
        path.join(__dirname, 'routes', 'routes.js'),
        path.join(__dirname, 'index.js')
    ]
};

const especificacionOpenAPI = swaggerJsdoc(opcionesSwagger);

function configurarOpenAPI(app) {
    app.use('/api-docs/assets', express.static(path.join(__dirname, 'docs')));

    app.get('/api-docs/openapi.json', (req, res) => {
        res.json(especificacionOpenAPI);
    });

    const interfazSwagger = [
        swaggerUi.serve,
        swaggerUi.setup(especificacionOpenAPI)
    ];

    app.use('/swagger', ...interfazSwagger);
    app.use('/api-docs/swagger', ...interfazSwagger);
    app.use('/api-docs', apiReference({
        url: '/api-docs/openapi.json',
        theme: 'purple',
        layout: 'modern'
    }));
}

module.exports = configurarOpenAPI;
