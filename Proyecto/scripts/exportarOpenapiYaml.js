import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import openapiSpec from './generarOpenapi.js';

const outputPath = fileURLToPath(new URL('../openapi.yaml', import.meta.url));
writeFileSync(outputPath, YAML.stringify(openapiSpec), 'utf8');
console.log(`Especificación OpenAPI guardada en ${outputPath}`);
