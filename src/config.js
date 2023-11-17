import path from 'path';
import { fileURLToPath } from 'url';

export { __dirname };

const __dirname = path.dirname(fileURLToPath(import.meta.url));