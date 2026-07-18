const Listing = require("../models/Listing");

exports.createListing = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      unit,
      pricePerUnit,
      type,
      harvestDate,
      description,
      imageUrl,
    } = req.body;
    if (!cropName || !quantity || !pricePerUnit || !type) {
      return res.status(400).json({
        message: "cropName, quantity, pricePerUnit and type are required",
      });
    }
    if (type === "upcoming" && !harvestDate) {
      return res
        .status(400)
        .json({ message: "harvestDate is required for upcoming listings" });
    }
    const listing = await Listing.create({
      farmer: req.user._id,
      cropName,
      quantity,
      unit,
      pricePerUnit,
      type,
      harvestDate,
      description,
      imageUrl,
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const filter = { status: "available" };
    if (req.query.type) filter.type = req.query.type;
    const listings = await Listing.find(filter)
      .populate("farmer", "name email")
      .sort("-createdAt");
    res.json(listings);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "farmer",
      "name email",
    );
    if (!listing)
      return (res.status(404).json({ message: "Listing not found" }));
    res.json(listing);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ farmer: req.user._id }).sort(
      "-createdAt",
    );
    res.json(listings);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your listing" });
    }
    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params._id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your listing" });
    }
    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
