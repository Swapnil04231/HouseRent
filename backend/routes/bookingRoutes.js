const express = require("express");
const router = express.Router();
const { createBooking, getBookings } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Property booking management
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for current user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get("/", protect, getBookings);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - bookingDate
 *             properties:
 *               propertyId:
 *                 type: string
 *               bookingDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post("/", protect, createBooking);

module.exports = router;