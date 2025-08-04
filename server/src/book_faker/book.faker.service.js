import { en, ru, fr, generateMersenne53Randomizer } from '@faker-js/faker';
import { prepareFakers } from './config/config.js';

export const config = {
    supportedLocales: [
        {
            locale: 'en_US',
            name: 'English (US)',
            definition: en,
            default: true,
        },
        {
            locale: 'ru_RU',
            name: 'Русский (Россия)',
            definition: ru,
        },
        {
            locale: 'fr_FR',
            name: 'Français (France)',
            definition: fr
        },
    ],
    likes: {
        min: 0,
        max: 10,
        step: 0.1
    },
    reviews: {
        min: 0,
        max: 10,
        step: 0.1
    },
    seed: {
        min: 1,
        max: 10000000,
        step: 1
    }
};

const fakers = await prepareFakers(config.supportedLocales);

const createBook = (faker, likes, reviews) => {
    return {
        author: faker.book.author(),
        title: faker.book.title(),
        genre: faker.book.genre(),
        publisher: faker.book.publisher(),
        format: faker.book.format(),
        date: faker.date.past({ years: 100 }),
        likes: faker.bookLike.likes(likes),
        reviews: faker.bookReview.reviews(reviews),
        cover: faker.bookCover.cover(),
        isbn: faker.commerce.isbn()
    };
}

export const generateFakeBooks = ({locale, seed, page, likes, reviews}) => {
    const books = [];
    const faker = fakers[locale];
    faker.setSeed(seed + page);

    const count = page === 1 ? 20 : 10;

    for (let i = 0; i < count; i++) {
        const book = createBook(faker, likes, reviews);
        book.index = (page - 1) * count + i + (page === 1 ? 0 : 10);
        books.push(book);
    }
    return books;
}