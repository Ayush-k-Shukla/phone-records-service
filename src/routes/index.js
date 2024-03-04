import express from 'express';
import { login, signup } from '../controllers/auth.controller.js';
import {
  getDetailsByPhone,
  searchByName,
  searchByPhone,
} from '../controllers/search.controller.js';
import { markAsSpam } from '../controllers/spam.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const routes = express.Router();

// auth routes
routes.post('/register', signup);
routes.post('/login', login);

// spam and search routes
routes.post('/mark-spam', authMiddleware, markAsSpam);
routes.get('/search/name', authMiddleware, searchByName);
routes.get('/search/phone', authMiddleware, searchByPhone);
routes.get('/search/:phone', authMiddleware, getDetailsByPhone);

export default routes;
