import { Request, Response } from "express";
import { bookingService } from "./booking.service";


// POST /bookings
 const createBooking = async (req: Request, res: Response) => {
  try {
 // customer
    
    const booking = await bookingService.createBooking({ ...req.body,  });
    res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message ,errors:err});
  }
};

// GET /bookings
 const getBookings = async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    const userId = req.user!.id;
    const bookings = await bookingService.getBookings(userId, role);
      if (!bookings|| bookings.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No booking found",
      data: []
    });
  }
    res.status(200).json({ success: true, message: "Bookings retrieved successfully", data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message,errors:err });
  }
};

// PUT /bookings/:bookingId
const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const role = req.user!.role;
    let status: "cancelled" | "returned";

    if (role === "customer") {
      status = "cancelled";
    } else if (role === "admin") {
      status = "returned";
    } else {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await bookingService.updateBookingStatus(bookingId, status);
    res.status(200).json({ success: true, message: "Booking updated successfully", data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message,errors:err });
  }
};



export const bookingController={
    createBooking ,
    getBookings,
    updateBooking
}