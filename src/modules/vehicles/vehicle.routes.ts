import { vehicleController } from './vehicle.controller';
import { Router } from "express";

import { authorizeRole, verifyToken } from "../../middleware/auth.middleware";


const router = Router();

// Admin-only
router.post("/", verifyToken, authorizeRole("admin"), vehicleController.createVehicle);
router.put("/:vehicleId", verifyToken, authorizeRole("admin"), vehicleController.updateVehicle);
router.delete("/:vehicleId", verifyToken, authorizeRole("admin"), vehicleController.deleteVehicle);

// Public
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getVehicleById);

export const vehicleRoutes=router;
