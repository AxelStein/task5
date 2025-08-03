import express from 'express';
import Joi from 'joi';
import controller from './book.controller.js';
import { config } from '../book_faker/book.faker.service.js';

const getBooksSchema = Joi.object({
    locale: Joi.string().valid(...config.supportedLocales.map(l => l.locale)).required(),
    seed: Joi.number().integer().required(),
    page: Joi.number().min(1).integer().required(),
    likes: Joi.number().min(config.likes.min).max(config.likes.max).required(),
    reviews: Joi.number().min(config.likes.min).max(config.likes.max).required(),
}).required();

const router = express.Router();

router.get('/books/list', (req, res) => {
    const { error, value } = getBooksSchema.validate(req.query);
    if (error) {
        return res.status(400).send(error.toString());
    }
    res.send(controller.getBooks(value));
});
router.get('/books/config', (req, res) => {
    const locales = config.supportedLocales.map(({ definition, ...rest }) => rest);
    res.send({
        ...config,
        supportedLocales: locales,
    });
});

export default router;