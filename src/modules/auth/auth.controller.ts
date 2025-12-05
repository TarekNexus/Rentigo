import { Request, Response } from "express";
import { authService } from "./auth.service";


 const signup = async (req: Request, res: Response) => {
  try {
    const user = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

 const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await authService.signin(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: data.token,
        user: data.user
      }
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};


export const authController={
    signup,
    signin
}