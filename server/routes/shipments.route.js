import { Router } from "express";
import { addFlightInfo, addNewHop, createShipment, getAllHops } from "../controllers/shipments.controllers.js";

const router = Router();

router.route("/create").post(createShipment);
router.route("/:shipment_number/hops/add").post(addNewHop);
router.route("/:shipment_number/flights/add").post(addFlightInfo);
router.route("/:shipment_number/hops").get(getAllHops);

export default router;