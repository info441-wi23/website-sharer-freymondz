import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import msIDExpress from 'microsoft-identity-express';

const appSettings = {
    appCredentials: {
        clientId: '5296bcea-1149-4493-9be5-3e498ac29740',
        tenantId: 'f6b6dd5b-f02f-441a-99a0-162ac5060bd2',
        clientSecret: 'QH18Q~5NAD~hpY8G-hxQ0lnRQ4HwqGREx5~_hdgd'
    },
    authRoutes: {
        redirect: 'http://441.freymond.dev/redirect',
        error: '/error',
        unauthorized: '/unauthorized'
    }
};

import models from './models.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import apiv1 from './routes/api/v1/apiv1.js';
import apiv2 from './routes/api/v2/apiv2.js';
import apiv3 from './routes/api/v3/apiv3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));
app.use(sessions({
    secret: 'Ryr2ajkVZYGNHAGXc5uLHSRM5t5CUJFf4',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

const msid = new msIDExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

app.use((req, res, next) => {
    req['models'] = models;
    next();
});

app.use('/api/v1', apiv1);
app.use('/api/v2', apiv2);
app.use('/api/v3', apiv3);

app.get('/signin',
    msid.signIn({ postLoginRedirect: '/' })
);

app.get('/signout',
    msid.signOut({ postLogoutRedirect: '/' })
);

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error");
});

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Unauthorized");
});

app.listen(3001, 'localhost', () => {
    console.log('Server is running on port 3001');
});

export default app;
