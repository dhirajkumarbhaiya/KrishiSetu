const express = require("express");
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get("/", getListings);
router.get("/my", protect, restrictTo("farmer"), getMyListings);
router.get("/:id", getListingById);
router.post("/", protect, restrictTo("farmer"), createListing);
router.put("/:id", protect, restrictTo("farmer"), updateListing);
router.delete("/:id", protect, restrictTo("farmer"), deleteListing);

module.exports = router;
