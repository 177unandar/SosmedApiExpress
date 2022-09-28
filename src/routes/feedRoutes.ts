import express from 'express';
import feedController from '../controllers/feedController';
import commentController from '../controllers/commentController';
const router = express.Router();

router.post('/', feedController.createFeed);
router.get('/', feedController.getFeeds);
router.post('/:feed_id/comment', commentController.createComment);
router.get('/:feed_id/comment', commentController.getComments);

export = router;