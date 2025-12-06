import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";


const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({ success: true, message: "Vehicle created successfully", data: vehicle });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

 const getAllVehicles = async (_req: Request, res: Response) => {
  const vehicles = await vehicleService.getAllVehicles();
  
  if (!vehicles || vehicles.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No vehicles found",
      data: []
    });
  }

  res.status(200).json({ success: true, message: "Vehicles retrieved successfully", data: vehicles });
};

const getVehicleById = async (req: Request, res: Response) => {
  const vehicle = await vehicleService.getVehicleById(Number(req.params.vehicleId));
  if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
  res.status(200).json({ success: true, message: "Vehicle retrieved successfully", data: vehicle });
};

const updateVehicle = async (req: Request, res: Response) => {
  const updated = await vehicleService.updateVehicle(Number(req.params.vehicleId), req.body);
  if (!updated) return res.status(404).json({ success: false, message: "Vehicle not found" });
  res.status(200).json({ success: true, message: "Vehicle updated successfully", data: updated });
};

const deleteVehicle = async (req: Request, res: Response) => {
  const success = await vehicleService.deleteVehicle(Number(req.params.vehicleId));
  if (!success) return res.status(400).json({ success: false, message: "Cannot delete vehicle with active bookings" });
  res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
};


export const vehicleController={
    createVehicle,
    getAllVehicles,
    getVehicleById ,
    updateVehicle,
    deleteVehicle
}