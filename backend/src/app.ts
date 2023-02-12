import express from 'express';
import { errorHandlerMiddleware, notFoundMiddleware } from './middlewares/index';
import { router } from './router';

export const app = express();

app.use(express.json());
app.use(router);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
