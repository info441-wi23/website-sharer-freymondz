import express from 'express';

const router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/like', async (req, res) => {
    if (!req.session.isAuthenticated) {
        res.status(401)
            .json({ status: 'error', error: 'not logged in' });
        return;
    }
    try {
        const post = await req.models.post.findOne({ _id: req.body.postID });
        if (!post.likes.includes(req.session.account.username)) {
            post.likes.push(req.session.account.username);
        }
        await post.save();
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({ error });
    }
});

router.post('/unlike', async (req, res) => {
    if (!req.session.isAuthenticated) {
        res.status(401)
            .json({ status: 'error', error: 'not logged in' });
        return;
    }

    try {
        const post = await req.models.post.findOne({ _id: req.body.postID });
        if (post.likes?.includes(req.session.account.username)) {
            post.likes.splice(post.likes.indexOf(req.session.account.username), 1);
        }
        await post.save();
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({ error });
    }
});

router.delete('/', async (req, res) => {
    if (!req.session.isAuthenticated) {
        res.status(401)
            .json({ status: 'error', error: 'not logged in' });
        return;
    }

    try {
        const post = await req.models.post.findOne({ _id: req.body.postID });
        if (post.username !== req.session.account.username) {
            res.status(401).json({ status: 'error', error: 'you can only delete your own posts' });
            return;
        }
        
        await req.models.comment.deleteMany({ post: req.body.postID });
        await req.models.post.deleteOne({ _id: req.body.postID });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({ error });
    }
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
            likes: [],
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
                        id: post._id,
                        description: post.description,
                        username: post.username,
                        htmlPreview: preview,
                        created_date: post.created_date,
                        likes: post.likes,
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