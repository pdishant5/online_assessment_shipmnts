import mongoose from "mongoose";

const shipmentsSchema = new mongoose.Schema({
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true,
    },
    hops: {
        type: [String],
    },
    shipment_number: {
        type: Number,
        unique: true,
        required: true
    },
}, { timestamps: true });

export const Shipment = mongoose.model("Shipment", shipmentsSchema);