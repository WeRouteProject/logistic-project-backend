import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../../.env.${currentEnv}`) });

dotenv.config({ path: path.resolve(__dirname, '../../.env.') });

import app from './app.js';

const PORT = process.env.PORT || 8769;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});