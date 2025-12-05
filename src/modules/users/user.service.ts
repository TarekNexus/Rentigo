import { pool } from "../../config/db";


// Get all users
 const getAllUsers = async () => {
  const result = await pool.query("SELECT id, name, email, phone, role FROM users ORDER BY id");
  return result.rows;
};

// Get user by id
const getUserById = async (userId: number) => {
  const result = await pool.query("SELECT id, name, email, phone, role FROM users WHERE id=$1", [userId]);
  return result.rows[0];
};

// Update user
const updateUser = async (userId: number, data: any) => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key of ["name", "email", "phone", "role"]) {
    if (data[key] !== undefined) {
      fields.push(`${key}=$${idx}`);
      values.push(data[key]);
      idx++;
    }
  }

  if (fields.length === 0) return getUserById(userId);

  values.push(userId);

  const query = `UPDATE users SET ${fields.join(", ")} WHERE id=$${idx} RETURNING id, name, email, phone, role`;
  const result = await pool.query(query, values);

  return result.rows[0];
};

// Delete user (only if no active bookings)
const deleteUser = async (userId: number) => {
  // check active bookings
  const { rows: bookings } = await pool.query(
    "SELECT id FROM bookings WHERE customer_id=$1 AND status='active'",
    [userId]
  );

  if (bookings.length > 0) throw new Error("Cannot delete user with active bookings");

  await pool.query("DELETE FROM users WHERE id=$1", [userId]);
};


export const userServices = {
 getAllUsers,
 getUserById,
 updateUser,
 deleteUser
};
