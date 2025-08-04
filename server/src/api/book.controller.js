import { generateFakeBooks } from '../book_faker/book.faker.service.js';
import { getBooksSchema } from './book.schemas.js';
import { config } from '../book_faker/book.faker.service.js';

const controller = {

    getConfig: (_req, res) => {
        const locales = config.supportedLocales.map(({ definition, ...rest }) => rest);
        res.send({
            ...config,
            supportedLocales: locales,
        });
    },

    getBooks: (req, res) => {
        const { error, value } = getBooksSchema.validate(req.query);
        if (error) {
            return res.status(400).send(error.toString());
        }
        res.send(generateFakeBooks(value));
    }
}

export default controller;