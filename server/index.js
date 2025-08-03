import 'dotenv/config';
import express from 'express';
import bookRouter from './src/api/book.router.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use('/api/v1', bookRouter);

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});