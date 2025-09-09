import { Flight } from "../models/flight.model.js";
import { Shipment } from "../models/shipments.model.js";

export const createShipment = async (req, res) => {
    try {
        const { origin, destination, shipment_number } = req.body;

        if([origin, destination, shipment_number].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "Origin and Destination are required fields!"
            });
        }
        
        const shipment = await Shipment.create({
            origin: origin.trim(),
            destination: destination.trim(),
            shipment_number: shipment_number,
            hops: [origin.trim(), destination.trim()]
        });

        const newShipment = await Shipment.findById(shipment._id);
        if (!newShipment) {
            return res.status(400).json({
                success: false,
                message: "Shipment creation falied!"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Shipment created successfuly!",
            data: {
                shipment_number: newShipment.shipment_number,
                hops: newShipment.hops
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};

export const addNewHop = async (req, res) => {
    try {
        const { previous_hop, next_hop, new_hop } = req.body;
        const { shipment_number } = req.params;

        if([previous_hop, next_hop, new_hop].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }
        if(!shipment_number) {
            return res.status(400).json({
                success: false,
                message: "Shipment number is required!"
            });
        }

        const existingShipment = await Shipment.findOne({ shipment_number });
        if(!existingShipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment with ID not found!"
            });
        }

        const index = existingShipment.hops.findIndex((hop) => hop === previous_hop);
        existingShipment.hops.splice(index+1, 0, new_hop);

        await existingShipment.save();

        return res.status(200).json({
            success: true,
            message: "Hop added successfully!",
            data: {
                shipment_number,
                hops: existingShipment.hops
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};

export const addFlightInfo = async (req, res) => {
    try {
        const {
            carrier,
            from,
            to,
            flight_number,
            departure,
            arrival
        } = req.body;
        const { shipment_number } = req.params;

        if ([carrier, from, to, flight_number].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }
        if (!shipment_number) {
            return res.status(400).json({
                success: false,
                message: "Shipment number is required!"
            });
        }

        const shipment = await Shipment.findOne({ shipment_number });
        if(!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment with ID not found!"
            });
        }

        const index = shipment.hops.findIndex((hop) => hop === from);
        if (shipment.hops[index+1] !== to) {
            return res.status(400).json({
                success: false,
                message: "Unable to add a flight. The 'from' and 'to' locations are not consecutive!"
            });
        }

        const flight = await Flight.create({
            carrier: carrier.trim(),
            from: from.trim(),
            to: to.trim(),
            flight_number: flight_number.trim(),
            shipment_number: shipment_number.trim(),
            departure: new Date(departure?.trim()),
            arrival: new Date(arrival?.trim())
        });

        const newFlight = await Flight.findById(flight._id);
        if(!newFlight) {
            return res.status(400).json({
                success: false,
                message: "Flight creation failed!"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Flight information added successfully!",
            data: {
                shipment_number,
                flight_number: newFlight.flight_number,
                flight_path: `${newFlight.from} - ${newFlight.carrier} - ${newFlight.to}`,
                departure: newFlight.departure,
                arrival: newFlight.arrival,
                status: newFlight.status
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};

export const getAllHops = async (req, res) => {
    try {
        const { shipment_number } = req.params;
        if(!shipment_number) {
            return res.status(400).json({
                success: false,
                message: "Shipment number is required!"
            });
        }

        const shipment = await Shipment.findOne({ shipment_number });
        if(!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment with ID not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hops Retrieved Successfully!",
            data: {
                shipment_number: shipment.shipment_number,
                hops: shipment.hops
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};