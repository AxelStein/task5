import express from 'express';
import controller from './book.controller.js';

const router = express.Router();
router.get('/books/list', controller.getBooks);
router.get('/books/config', controller.getConfig);

export default router;