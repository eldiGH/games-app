import express from 'express';
import './controllers';
import { router } from './router';

export const app = express();

app.use(router);

console.log(router);
