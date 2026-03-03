const Booking = require("../models/Booking"); // optional if you have a Booking model

// Create a booking
const createBooking = async (req, res) => {
  try {
    // Dummy response
    res.status(201).json({
      message: "Booking created successfully",
      booking: {
        propertyId: req.body.propertyId,
        user: req.user.id,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for the current user
const getBookings = async (req, res) => {
  try {
    // Dummy response
    res.json([
      {
        id: "1",
        propertyId: "123",
        user: req.user.id,
        startDate: "2026-03-01",
        endDate: "2026-03-10",
      },
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings };