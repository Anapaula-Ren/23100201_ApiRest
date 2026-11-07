import { Router } from 'express';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const rapidocBundlePath = require.resolve('rapidoc');
const router = Router();

router.get('/', (req, res) => {
    res.sendFile(fileURLToPath(new URL('../../public/api-reference.html', import.meta.url)));
});

router.get('/rapidoc-min.js', (req, res) => {
    res.sendFile(rapidocBundlePath);
});

export default router;
