import express from 'express';
import controller from '../controllers/feedController';
const router = express.Router();

router.post('/', controller.createFeed);
router.get('/', controller.getFeeds);

export = router;