import { Faker, en, base } from '@faker-js/faker';
import BookCoverDefinition from './BookCoverDefinition.js';
import BookReviewDefinition from './BookReviewDefinition.js';
import BookLikesDefinition from './BookLikesDefinition.js';
import csv from 'csv-parser';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const readDataFile = (file) => new Promise((resolve, reject) => {
    const d = [];
    const rs = fs.createReadStream(path.join(__dirname, '..', 'data/', file));

    rs.pipe(csv())
        .on('data', (data) => d.push(data))
        .on("end", () => resolve(d))
        .on("error", (err) => reject(err));
    rs.on('error', (err) => reject(err));
});

export const prepareFakers = async (supportedLocales) => {
    const authors = await readDataFile('author.csv');
    const formats = await readDataFile('format.csv');
    const genres = await readDataFile('genre.csv');
    const publishers = await readDataFile('publisher.csv');
    const reviews = await readDataFile('review.csv');
    const titles = await readDataFile('title.csv');
    const covers = await readDataFile("cover.csv");

    const fakers = {};
    supportedLocales.map((l) => {
        const book = {
            author: authors.map(v => v[l.locale]),
            format: formats.map(v => v[l.locale]),
            genre: genres.map(v => v[l.locale]),
            publisher: publishers.map(v => v[l.locale]),
            title: titles.map(v => v[l.locale]),
        };

        l.definition.book = book;

        const createFaker = () => new Faker({ locale: [l.definition, en, base] });

        const faker = createFaker();
        const numFaker = createFaker();
        faker.setSeed = (seed) => {
            faker.seed(seed);
            numFaker.seed(seed);
        }
        faker.bookCover = new BookCoverDefinition(faker, covers.map(v => v.en_US));
        faker.bookLike = new BookLikesDefinition(numFaker);
        faker.bookReview = new BookReviewDefinition(numFaker, reviews.map(v => v[l.locale]));
        fakers[l.locale] = faker;
    });
    return fakers;
};