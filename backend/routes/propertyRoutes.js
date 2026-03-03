const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createProperty,
  getProperties,
  approveProperty,
} = require("../controllers/propertyController");

/**
 * @swagger
 * tags:
 *   name: Property
 *   description: Property Management APIs
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all approved properties
 *     tags: [Property]
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get("/", getProperties);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create property (User only)
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Property created (pending approval)
 */
router.post("/", protect, createProperty);

/**
 * @swagger
 * /api/properties/{id}/approve:
 *   put:
 *     summary: Approve property (Admin only)
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property approved
 */
router.put("/:id/approve", protect, adminOnly, approveProperty);

module.exports = router;