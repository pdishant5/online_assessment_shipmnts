import { Router } from "express";
import { retrieveFlights, updateFlightStatus } from "../controllers/flight.controllers.js";

const router = Router();

router.route("/:flight_number/status").post(updateFlightStatus);
router.route("/query").get(retrieveFlights);

export default router;