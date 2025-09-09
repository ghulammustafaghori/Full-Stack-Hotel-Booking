const express = require('express');
const { checkAvailabilityAPI, createBooking, getUserBookings, getHotelBookings } = require('../controllers/bookingController.js');

const protect = require('../middleware/authMiddleware.js');

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking)
bookingRouter.get('/user',protect, getUserBookings);
bookingRouter.get('/hotel',protect, getHotelBookings);

module.exports = bookingRouter;