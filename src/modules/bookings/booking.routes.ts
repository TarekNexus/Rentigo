import { Router } from "express";
import { authorizeRole, verifyToken } from "../../middleware/auth.middleware";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", verifyToken, authorizeRole("customer", "admin"), bookingController.createBooking);
router.get("/", verifyToken, authorizeRole("customer", "admin"), bookingController.getBookings);
router.put("/:bookingId", verifyToken, authorizeRole("customer", "admin"), bookingController.updateBooking);

export const bookingRoutes=router;
