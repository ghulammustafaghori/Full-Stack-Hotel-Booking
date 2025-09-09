//API to create a new room for a hotel
const cloudinary = require('cloudinary').v2
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const createRoom = async (req, res) => {
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userId})
        if(!hotel) return res.json({success: false, message: "Hotel Not Found"})

            //upload image to cloudinary
            const uploadImages = req.files.map(async (file) => {
                const response = await cloudinary.uploader.upload(file.path);
                return response.secure_url;
            })
            //Wait for all uploads to complete
            const images=await Promise.all(uploadImages);

        await Room.create({roomType, pricePerNight: +pricePerNight, amenities: JSON.parse(amenities), images, hotel: hotel._id});
        res.json({success: true, message: "Room Created Successfully"});
        
    } catch {
        res.json({success: false, message: error.message});
    }
}

//API to get all rooms
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true}).populate({
            path: 'hotel', 
            populate: {
            path: 'owner', 
            select: 'image'
        }
    }).sort({ createdAt: -1});
        res.json({success: true, rooms});
    } catch {
        res.json({success: false, message: error.message});
    }
}

//API to get all rooms for a specific hotel
const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel({owner: req.auth.userId});
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate('hotel');
        res.json({success: true, rooms});
    } catch {
        res.json({success: false, message: error.message});
    }
}

//API to toggle availability of a room
const toggleRoomAvailability = async (req, res) => {
    try {
        const {roomId} = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({success: true, message: "Room Availability Updated"});
    } catch {
        res.json({success: false, message: error.message});
    }
}

module.exports = {createRoom, getRooms, getOwnerRooms, toggleRoomAvailability}