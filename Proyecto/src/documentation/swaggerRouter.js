import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from '../../scripts/generarOpenapi.js';

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
    swaggerOptions: {
        docExpansion: 'none',
        defaultModelsExpandDepth: 1
    }
}));

export default router;
