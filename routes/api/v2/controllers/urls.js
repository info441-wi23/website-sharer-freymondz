import express from 'express';

const router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.get('/preview', async (req, res) => {
    try {
        const url = req.query.url?.toString();
        if (url === undefined) {
            res.status(400).json({ message: 'Missing URL' });
            return;
        }
        const preview = getURLPreview(url);
    
        res.type("html");
        res.send(preview);
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;