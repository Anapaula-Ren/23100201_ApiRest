import { Router } from 'express';
import openapiSpec from '../../scripts/generarOpenapi.js';

const router = Router();

router.get('/', (req, res) => {
    res.json(openapiSpec);
});

export default router;
