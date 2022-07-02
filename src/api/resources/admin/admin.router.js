import express from 'express';
import adminController from './admin.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { localStrategyAdmin } from '../../../middleware/strategy';
import { validateBody, schemas } from '../../../helpers/routeHelper';

export const adminRouter = express.Router();

adminRouter.route('/login').post(sanitize(), adminController.login);