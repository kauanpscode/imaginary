import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../config/db";

const saltRounds = 10;

interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userByEmail = await pool.query<UserRow>(
      "SELECT u.* FROM users u WHERE u.email = $1",
      [email],
    );

    if (userByEmail.rows.length === 0) {
      return res.status(401).json({ message: "User not found." });
    }

    const user = userByEmail.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "User or password incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    // Use 'return' para garantir que a função pare aqui
    return res.json({
      message: "Sucessfully logged in.",
      token: token,
      user: { id: user.id, username: user.username },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email],
    );

    if (userExists.rows.length > 0) {
      return res.status(401).json({ message: "User already exists." });
    }

    const validation = verifyFields(req.body);

    if (validation.length > 0) {
      const message =
        validation.length >= 2
          ? `Fields ${validation.join(", ")} are required.`
          : `The field ${validation[0]} is required.`;
      return res.status(401).json({ message });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Importante: Use RETURNING no SQL para o TS saber o que voltou
    const newUser = await pool.query<UserRow>(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword],
    );

    const user = newUser.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    return res.json({
      message: "User registered successfully.",
      token: token,
      user: { id: user.id, username: user.username },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal error." });
  }
};

function verifyFields(fields: any): string[] {
  const requiredFields: Record<string, string> = {
    username: "nome",
    email: "email",
    password: "senha",
  };

  let emptyFields: string[] = [];

  for (let key in requiredFields) {
    if (!fields[key]) {
      emptyFields.push(requiredFields[key]);
    }
  }

  return emptyFields;
}
