import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import openapiSpec from '../../scripts/generarOpenapi.js';

const router = Router();

router.use('/', apiReference({
    content: openapiSpec
}));

export default router;
