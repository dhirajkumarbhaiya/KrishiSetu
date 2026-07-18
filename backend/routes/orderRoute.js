const express = require("express");
const router = express.Router();
const {
  createOrder,
  payOrder,
  cancelOrder,
  getMyPurchases,
  getMySales,
} = require("../controllers/orderController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/", protect, restrictTo("buyer"), createOrder);
router.get("/my-purchases", protect, restrictTo("buyer"), getMyPurchases);
router.get("/my-sales", protect, restrictTo("farmer"), getMySales);
router.patch("/:id/pay", protect, restrictTo("buyer"), payOrder);
router.patch("/:id/cancel", protect, cancelOrder);

module.exports = router;
