const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ['apartment', 'house', 'studio', 'villa'],
      required: true,
    },
    images: [{ type: String }],
    amenities: [{ type: String }],
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);