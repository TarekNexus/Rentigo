
import { pool } from "../../config/db";
import { vehicleService } from "../vehicles/vehicle.service";

 interface Booking {
  id?: number; 
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string; 
  rent_end_date: string;   
  total_price: number;    
  status: "active" | "cancelled" | "returned";
}

// Create a booking
const createBooking = async (booking: Partial<Booking>) => {


  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = booking;

  // 1. Find vehicle
  const vehicle = await vehicleService.getVehicleById(vehicle_id!);
  if (!vehicle) throw new Error("Vehicle not found");

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  // 2. Calculate days
 // 2. Calculate days
const start = new Date(rent_start_date!);
const end = new Date(rent_end_date!);

// validate date
if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  throw new Error("Invalid date format. Use YYYY-MM-DD");
}

if (end <= start) {
  throw new Error("End date must be after start date");
}

const days =
  Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

const total_price = days * Number(vehicle.daily_rent_price);

  // 3. Insert booking
  const result = await pool.query(
    `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1,$2,$3,$4,$5,'active')
    RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const newBooking = result.rows[0];

  // 4. Update vehicle status
  await vehicleService.updateVehicle(vehicle_id!, { availability_status: "booked" });

  // 5. Return in required structure
  return {
    ...newBooking,
      rent_start_date: rent_start_date,
  rent_end_date: rent_end_date,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    }
  };
};

const formatDate = (date: string | Date) => new Date(date).toISOString().split("T")[0];

const getBookings = async (userId?: number, role?: "admin" | "customer") => {
  if (role === "admin") {
    const result = await pool.query(`
      SELECT 
        b.*,
        u.name as customer_name,
        u.email as customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);

    return result.rows.map((b: any) => ({
      id: b.id,
      customer_id: b.customer_id,
      vehicle_id: b.vehicle_id,
      rent_start_date: formatDate(b.rent_start_date),
      rent_end_date: formatDate(b.rent_end_date),
      total_price: b.total_price,
      status: b.status,
      customer: {
        name: b.customer_name,
        email: b.customer_email
      },
      vehicle: {
        vehicle_name: b.vehicle_name,
        registration_number: b.registration_number
      }
    }));
  }

  // CUSTOMER VIEW
  const result = await pool.query(`
    SELECT 
      b.*,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
  `, [userId]);

  return result.rows.map((b: any) => ({
    id: b.id,
    vehicle_id: b.vehicle_id,
    rent_start_date: formatDate(b.rent_start_date),
    rent_end_date: formatDate(b.rent_end_date),
    total_price: b.total_price,
    status: b.status,
    vehicle: {
      vehicle_name: b.vehicle_name,
      registration_number: b.registration_number,
      type: b.type
    }
  }));
};

// Update booking status (cancel/return)
const updateBookingStatus = async (bookingId: number, status: "cancelled" | "returned") => {



  const bookingRes = await pool.query("SELECT * FROM bookings WHERE id=$1", [bookingId]);
  if (!bookingRes.rows[0]) throw new Error("Booking not found");

  const booking = bookingRes.rows[0];

  await pool.query("UPDATE bookings SET status=$1 WHERE id=$2", [status, bookingId]);

  if (status === "returned") {
    await vehicleService.updateVehicle(booking.vehicle_id, { availability_status: "available" });

    return {
      ...booking,
       rent_start_date: formatDate(booking.rent_start_date),
    rent_end_date: formatDate(booking.rent_end_date),
      status,
      vehicle: {
        availability_status: "available"
      }
    };
  }

  return {
    ...booking,
       rent_start_date: formatDate(booking.rent_start_date),
    rent_end_date: formatDate(booking.rent_end_date),
    status
  };
};


export const bookingService = {
  createBooking,
  getBookings,
  updateBookingStatus
};

