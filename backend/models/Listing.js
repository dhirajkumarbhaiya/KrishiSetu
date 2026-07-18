const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "kg",
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["ready", "upcoming"],
      required: true,
    },
    harvestDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "booked", "sold"],
      default: "available",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Listing", listingSchema);
