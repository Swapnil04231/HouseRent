const Property = require("../models/Property");

// Create Property (User)
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Approved Properties (Public)
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" })
      .populate("owner", "name email");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Approve Property
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.status = "approved";
    await property.save();

    res.json({ message: "Property approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};