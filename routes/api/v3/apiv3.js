import express from 'express';
const router = express.Router();

import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';
import usersRouter from './controllers/users.js';
import commentsRouter from './controllers/comments.js';
import userRouter from './controllers/user.js';

router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter);
router.use('/user', userRouter);

export default router;