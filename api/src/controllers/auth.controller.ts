import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const USERS: any[] = []; // In-memory user store for Week 1 demo
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-week-1";

export class AuthController {
  public async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password required" });
      }

      const existingUser = USERS.find((u) => u.username === username);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: Date.now(), username, password: hashedPassword };
      USERS.push(newUser);

      console.log(`User registered: ${username}`);
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = USERS.find((u) => u.username === username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ token, username });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
