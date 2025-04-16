import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './services/errors/errorHandler.js';
dotenv.config();
import logger from './utils/logger.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mockRouter from './routes/mocks.router.js';
import loggerRouter from './routes/logger.router.js'
const app = express();
const PORT = process.env.PORT || 8081;
const MONGO_URL = process.env.MONGO_URL;
mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URL)

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    req.logger = logger;
    next();
});

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mockRouter);
app.use('/api/loggerTest', loggerRouter);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
console.log(process.env.NODE_ENV)


app.use(errorHandler);