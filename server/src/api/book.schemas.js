import { config } from '../book_faker/book.faker.service.js';
import Joi from 'joi';

export const getBooksSchema = Joi.object({
    locale: Joi.string().valid(...config.supportedLocales.map(l => l.locale)).required(),
    seed: Joi.number().integer().required(),
    page: Joi.number().min(1).integer().required(),
    likes: Joi.number().min(config.likes.min).max(config.likes.max).required(),
    reviews: Joi.number().min(config.likes.min).max(config.likes.max).required(),
}).required();