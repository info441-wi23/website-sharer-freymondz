import express from 'express';

const router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/like', (req, res) => {

});

router.post('/unlike', (req, res) => {

});

router.delete('/', (req, res) => {
    
});

router.post('/', (req, res) => {
    if (!req.session.isAuthenticated) {
        res.status(401)
            .json({ status: 'error', error: 'not logged in' });
        return;
    }

    try {
        const post = {
            ...req.body,
            username: req.session.account.username,
            created_date: new Date(),
        };
        req.models.post.create(post);

        res.status(200)
            .json({ status: 'sucess' });
    } catch (error) {
        res.status(500)
            .json({ error });
    }
});


router.get('/', async (req, res) => {
    try {
        let username = {};
        if (req.query.username) {
            username = { username: req.query.username };
        }
        const posts = await req.models.post.find(username);
        const previews = await Promise.all(
            posts.map(async post => {
                try {
                    const preview = await getURLPreview(post.url);
                    return {
                        description: post.description,
                        username: post.username,
                        htmlPreview: preview,
                    };
                } catch (error) {
                    return {
                        description: post.description,
                        htmlPreview: 'Error',
                    };
                }
            })
        );
        res.status(200)
            .json(previews);
    } catch (error) {
        res.status(500)
            .json({ error });
    }
});

export default router;