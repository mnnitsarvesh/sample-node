import express from 'express';
import { authRouter } from './resources/modules/auth';

export const webRouter = express.Router();
webRouter.use('/', [
    authRouter,
]);