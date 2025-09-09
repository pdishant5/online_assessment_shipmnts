import mongoose from "mongoose";

const flightsSchema = new mongoose.Schema({
    carrier: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    flight_number: {
        type: String,
        unique: true,
        required: true
    },
    shipment_number: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: "Shipment"
    },
    departure: {
        type: Date
    },
    arrival: {
        type: Date
    },
    status: {
        type: String,
        enum: {
            values: ["in-transit", "landed"],
            default: "in-transit"
        }
    }
}, { timestamps: true });

export const Flight = mongoose.model("Flight", flightsSchema);