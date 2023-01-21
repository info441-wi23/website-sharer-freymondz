import express from 'express';

const router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', (req, res) => {
    try {
        const post = {
            url: req.body.url,
            description: req.body.description,
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
        const posts = await req.models.post.find({});
        const previews = await Promise.all(
            posts.map(async post => {
                try {
                    const preview = await getURLPreview(post.url);
                    return {
                        description: post.description,
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