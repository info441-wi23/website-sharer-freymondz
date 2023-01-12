import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import apiv1 from './routes/api/v1/apiv1.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/api/v1', apiv1);

app.listen(3000, 'localhost', () => {
    console.log('Server is running on port 3000');
});

export default app;
