import { generateFakeBooks } from '../book_faker/book.faker.service.js';

const controller = {

    getBooks: (params) => {
        const { locale, seed, page, likes, reviews } = params;
        return generateFakeBooks(locale, seed, page, likes, reviews);
    }
}

export default controller;