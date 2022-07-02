import express from 'express';
import authController from './auth.controller';
import { loginCheck } from '../../../../middleware/auth';

export const authRouter = express.Router();
authRouter.route('/login').get(loginCheck(), authController.login);