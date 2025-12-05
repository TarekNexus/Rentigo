
import { Router } from "express";
import { UserControllers } from "./user.controller";
import { authorizeRole, verifyToken } from "../../middleware/auth.middleware";


const router = Router();


router.get("/", verifyToken, authorizeRole("admin"), UserControllers.getAllUsers);


router.put("/:userId", verifyToken, UserControllers.updateUser);


router.delete("/:userId", verifyToken, authorizeRole("admin"), UserControllers.deleteUser);

export const userRoutes=router;
