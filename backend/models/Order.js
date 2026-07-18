const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    orderType: { type: String, enum: ['direct', 'booking'], required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    amountDue: { type: Number, required: true }, //full amount for 'direct', 20% advance for 'booking'
    status: { type: String, enum: ['pending_payment', 'confirmed', 'cancelled'], default: 'pending_payment' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
