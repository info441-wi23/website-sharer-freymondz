import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const postID = req.query.postID;
        const post = await req.models.comment.find({ post: postID });
        res.status(200)
            .json(post);
    } catch (error) {
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
        const comment = {
            username: req.session.account.username,
            comment: req.body.newComment,
            post: req.body.postID,
            created_date: new Date(),
        };
        req.models.comment.create(comment);

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500)
            .json({ error });
    }
});

export default router;