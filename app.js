import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import models from './models.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import apiv1 from './routes/api/v1/apiv1.js';
import apiv2 from './routes/api/v2/apiv2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
    req['models'] = models;
    next();
});

app.use('/api/v1', apiv1);
app.use('/api/v2', apiv2);

app.listen(8081,() => {
    console.log('Server is running on port 8081');
});

export default app;
