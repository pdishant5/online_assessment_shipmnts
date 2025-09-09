import { Flight } from "../models/flight.model.js";

export const updateFlightStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { flight_number } = req.params;

        if(!status || status?.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Flight status is required!"
            });
        }
        if(!flight_number) {
            return res.status(400).json({
                success: false,
                message: "Flight ID is required!"
            });
        }

        const flight = await Flight.findOne({ flight_number });
        if(!flight) {
            return res.status(404).json({
                success: false,
                message: `Flight with ID ${flight_number} not found!` 
            });
        }

        flight.status = status;
        await flight.save();

        return res.status(200).json({
            success: true,
            message: "Flight status updated!",
            data: {
                flight_number: flight.flight_number,
                status: flight.status
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};

export const retrieveFlights = async (req, res) => {
    try {
        const { carrier, start_date, end_date } = req.query;

        if([carrier, start_date, end_date].some((field) => !field || field?.trim() === '')) {
            return res.status(400).json({
                success: false,
                message: "Required query parameters 'carrier', 'start_date', and 'end_date' must be provided!"
            });
        }
        start_date = new Date(start_date);
        end_date = new Date(end_date);

        const flights = await Flight.find({
            carrier,
            departure: { $gt: start_date },
            arrival: { $lt: end_date }
        });

        if(!flights) {
            return res.status(404).json({
                success: false,
                message: "No flights found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Flights retrieved successfully",
            data: flights
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};