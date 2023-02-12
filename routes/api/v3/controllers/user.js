import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    const username = req.query.user;
    const userinfo = await req.models.user.findOne({ username: username });
    res.status(200).json(userinfo);
});

router.post('/', async (req, res) => {
    const userinfo = req.body;
    await req.models.user.findOneAndUpdate({ username: userinfo.username }, userinfo, { upsert: true });
    res.status(200).json({ success: true });
});

export default router;