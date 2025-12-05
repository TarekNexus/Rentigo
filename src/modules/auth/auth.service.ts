
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "admin" | "customer";
}

const signup = async (payload: SignupPayload) => {
  const { name, email, password, phone, role = "customer" } = payload;

  if (!name || !email || !password || !phone) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const lowerEmail = email.toLowerCase();

  // check if user exists
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email=$1",
    [lowerEmail]
  );

  if (existingUser.rowCount !== 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [name, lowerEmail, hashedPassword, phone, role]
  );

  return result.rows[0];
};

 const signin = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const lowerEmail = email.toLowerCase();

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [lowerEmail]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );




  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  };
};



export const authService = {
  signin,
  signup
};
