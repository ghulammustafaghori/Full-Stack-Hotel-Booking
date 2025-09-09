const { get } = require("mongoose");
const Booking = require("../models/Booking.js");
const Room = require("../models/Room.js");
const Hotel = require("../models/Hotel.js");

//Function to Check Availability of Room
const checkAvailability = async (req, res) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate}
        })
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
            }
}


//API to check availability of room
//POST /api/booking/check-availability
const checkAvailabilityAPI = async (req, res) => {
    try {
        const {room, checkInDate, checkOutDate} = req.body;
        
        const isAvailable = await checkAvailability(room, checkInDate, checkOutDate);
        res.json({success: true, isAvailable});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

//API to create a new booking
// POST /api/bookings/book

const createBooking = async (req,res)=>{
    try{
        const {room, checkInDate, checkOutDate, guests} = req.body;
        const user = req.user._id;

        //Before Booking Check Availability
        const isAvailable = await checkAvailability(room, checkInDate, checkOutDate);
        if(!isAvailable) {return res.json({success: false, message: "Room Not Available"})}
        //Get totalPrice from Room
        const roomData=await Room.findById(room).populate('hotel');
        let totalPrice = roomData.pricePerNight;

        //Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice = totalPrice * nights;

        const booking=await Booking.create({user, room,hotel: roomData.hotel._id, checkInDate, checkOutDate, guests:+guests, totalPrice});
        res.json({success: true, message: "Booking Created Successfully", booking});


    } catch(error) {
        console.log(error);
        res.json({success: false, message: "Failed to create booking"});
    }
}

//API to get all bookings for a user
//GET /api/bookings/user

const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate('room hotel').sort({createdAt: -1});
        res.json({success: true, bookings});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({owner: req.auth.userId});
        if(!hotel){
            return res.json({success: false, message: "Hotel Not Found"});
        }
        const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({ created: -1});
        //Total Bookings
        const totalBookings = bookings.length;
        //Total Renvenue
        const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice,0)
        res.json({success: true, dasboardDate: {totalBookings, totalRevenue, bookings}});
        } catch {
        res.json({success: false, message: "Failed to fetch bookings"});
    }
}
module.exports = {checkAvailabilityAPI, createBooking, getUserBookings, getHotelBookings};