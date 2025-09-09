const express = require('express');
const protect  = require('../middleware/authMiddleware.js');
const { getUserData, storeRecentSearchCities } = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSearchCities);

module.exports = userRouter;