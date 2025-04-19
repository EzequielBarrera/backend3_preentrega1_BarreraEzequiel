import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
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
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    req.logger = logger;
    next();
});

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Proyecto Adopt Me (Ezequiel Barrera)",
            version: "1.0.0",
            description: "Documentación para uso de Swagger"
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: "Testing"
            },
            {
                url: 'http://localhost:3001',
                description: "Desarrollo"
            },
            {
                url: 'http://localhost:8080',
                description: "Producción"
            },
        ]
    },
    apis: ["./src/docs/*.yaml"]
}

const specs = swaggerJSDoc(options)

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mockRouter);
app.use('/api/loggerTest', loggerRouter);

app.listen(PORT)


app.use(errorHandler);