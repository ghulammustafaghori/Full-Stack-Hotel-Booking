const Hotel = require('../models/Hotel');
const User = require('../models/User');

const registerHotel = async (req,res) => {
    try{
        const {name,address,contact,city} = req.body;
        const owner = req.user._id;

        //Check if User Already Registered
        const hotel = await Hotel.findOne({owner});
        if(hotel){
            res.json({success: false, message: "Hotel Already Registered"});
        }

        await Hotel.create({name,address,contact,owner,city});
        await User.findByIdAndUpdate(owner,{role: 'hotelOwner'});
        res.json({success: true, message: "Hotel Registered Successfully"});

    } catch {
        res.json({success: false, message: error.message});

    }
}

const getHotelBookings = async (req,res) => {
    try{

        const hotel = await Hotel.findOne({owner: req.user._id});
    if(!hotel) {
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

module.exports = {registerHotel};