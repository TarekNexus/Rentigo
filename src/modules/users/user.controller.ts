
import { Request, Response } from "express";
import { userServices } from "./user.service";


 const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message,errors:err });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    // Customer can only update own profile
    if (req.user?.role === "customer" && req.user.id !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await userServices.updateUser(userId, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message,errors:err });
  }
};

 const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    await userServices.deleteUser(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message,errors:err });
  }
};


export const UserControllers={
   
    getAllUsers,
    updateUser,
    deleteUser 
}