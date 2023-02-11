import express from 'express';
import './controllers';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';
import { router } from './router';

export const app = express();

app.use(express.json());
app.use(router);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
