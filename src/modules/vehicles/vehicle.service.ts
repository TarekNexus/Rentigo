import { pool } from "../../config/db";
interface Vehicle {
  id?: number;
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status: "available" | "booked";
}

const createVehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicle;
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result.rows[0];
};

const getAllVehicles = async (): Promise<Vehicle[]> => {
  const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
  return result.rows;
};

const getVehicleById = async (id: number): Promise<Vehicle | null> => {
  const result = await pool.query("SELECT * FROM vehicles WHERE id=$1", [id]);
  return result.rows[0] || null;
};

const updateVehicle = async (
  id: number,
  vehicle: Partial<Vehicle>
): Promise<Vehicle | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key in vehicle) {
    fields.push(`${key} = $${idx}`);
    values.push((vehicle as any)[key]);
    idx++;
  }

  if (!fields.length) return getVehicleById(id);

  values.push(id);
  const result = await pool.query(
    `UPDATE vehicles SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

const deleteVehicle = async (id: number): Promise<boolean> => {
  // Check if vehicle has active bookings
  const check = await pool.query(
    "SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'",
    [id]
  );
  if (check.rows.length > 0) return false;

  await pool.query("DELETE FROM vehicles WHERE id=$1", [id]);
  return true;
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
