const Order = require("../models/Order");
const Listing = require("../models/Listing");

const ADVANCE_PERCENT = 0.2; //20%upfront for booked (upcoming) listings

exports.createOrder = async (req, res) => {
  try {
    const { listingId } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.status !== "available") {
      return res
        .status(400)
        .json({ message: "Listing is no longer available" });
    }

    const totalAmount = listing.quantity * listing.pricePerUnit;
    const orderType = listing.type === "upcoming" ? "booking" : "direct";
    const amountDue =
      orderType === "booking"
        ? Math.round(totalAmount * ADVANCE_PERCENT)
        : totalAmount;

    const order = await Order.create({
      listing: listing._id,
      buyer: req.user._id,
      farmer: listing.farmer,
      orderType,
      quantity: listing.quantity,
      pricePerUnit: listing.pricePerUnit,
      totalAmount,
      amountDue,
    });

    listing.status = orderType === "booking" ? "booked" : "sold";
    await listing.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }
    if (order.status !== "pending_payment") {
      return res
        .status(400)
        .json({ message: `Order is already ${order.status}` });
    }
    order.status = "confirmed";
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const involved = [order.buyer.toString(), order.farmer.toString()].includes(
      req.user._id.toString(),
    );
    if (!involved)
      return res.status(403).json({ message: "Not part of this order" });
    if (order.status !== "pending_payment") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }
    order.status = "cancelled";
    await order.save();
    await Listing.findByIdAndUpdate(order.listing, { status: "available" });
    res.json({ message: "Order cancelled, listing reopened" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPurchases = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate("listing")
    .sort("-createdAt");
  res.json(orders);
};

exports.getMySales = async (req, res) => {
  const orders = await Order.find({ farmer: req.user._id })
    .populate("listing")
    .populate("buyer", "name email")
    .sort("-createdAt");
  res.json(orders);
};
