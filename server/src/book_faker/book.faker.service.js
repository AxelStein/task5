import { en, ru, fr, generateMersenne53Randomizer } from '@faker-js/faker';
import { prepareFakers } from './config/index.js';

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
            definition: ru
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
    },
    reviews: {
        min: 0,
        max: 10
    }
};

const fakers = await prepareFakers(config.supportedLocales);

const createBook = (faker, likeCount, reviewCount) => {
    return {
        author: faker.book.author(),
        title: faker.book.title(),
        genre: faker.book.genre(),
        publisher: faker.book.publisher(),
        format: faker.book.format(),
        date: faker.date.past({ years: 100 }),
        likes: likeCount,
        reviews: faker.bookReview.reviews(reviewCount),
        cover: faker.bookCover.cover(),
        isbn: faker.commerce.isbn()
    };
}

export const generateFakeBooks = (locale, seed, page, likes, reviews) => {
    seed += page;

    const books = [];
    const faker = fakers[locale];
    faker.seed(seed);
    faker.numFaker.seed(seed);

    const getNextInt = (probability) => {
        return Math.floor(probability) + (faker.numFaker.number.float() < probability % 1 ? 1 : 0);
    }

    const count = page === 1 ? 20 : 10;

    for (let i = 0; i < count; i++) {
        const book = createBook(faker, getNextInt(likes), getNextInt(reviews));
        book.index = (page - 1) * count + i + (page === 1 ? 0 : 10);
        books.push(book);
    }
    return books;
}