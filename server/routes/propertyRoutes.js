const express = require('express');
const router = express.Router();
const { Property, Booking } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');

// Helper to get start and end of day in UTC
const getUTCDayRange = (dateStr) => {
  const date = new Date(dateStr);
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
};

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 */
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('ownerId', 'name email');
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a property by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @swagger
 * /api/properties/{id}/availability:
 *   get:
 *     summary: Check property availability for a date range
 */
router.get('/:id/availability', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const { start: startOfDay, end: endOfDay } = getUTCDayRange(startDate);
    const { start: endOfDayForEnd } = getUTCDayRange(endDate); // for the end date's end of day

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Find any non‑cancelled bookings that overlap the requested range
    const overlapping = await Booking.find({
      propertyId: req.params.id,
      status: { $ne: 'cancelled' },
      $or: [
        // Booking starts within range
        { startDate: { $gte: startOfDay, $lte: endOfDayForEnd } },
        // Booking ends within range
        { endDate: { $gte: startOfDay, $lte: endOfDayForEnd } },
        // Booking contains the whole range
        { startDate: { $lte: startOfDay }, endDate: { $gte: endOfDayForEnd } }
      ]
    });

    console.log(`Availability check for property ${req.params.id}:`, {
      requestedStart: startOfDay,
      requestedEnd: endOfDayForEnd,
      overlappingCount: overlapping.length,
      overlappingDetails: overlapping.map(b => ({
        id: b._id,
        start: b.startDate,
        end: b.endDate,
        status: b.status
      }))
    });

    res.json({ available: overlapping.length === 0 });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property (admin only)
 */
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, price, location, type, images, amenities, bedrooms, bathrooms } = req.body;
    const property = await Property.create({
      title,
      description,
      price,
      location,
      type,
      images,
      amenities,
      bedrooms,
      bathrooms,
      ownerId: req.user.id,
    });
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update a property (admin only)
 */
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete a property (admin only)
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;