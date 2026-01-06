import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PasswordHasher } from "./utils/crypto";

const app = express();
const PORT = 3000;
const JWT_SECRET = "this-is-the-secure-key-for-test";
const users: any[] = [];

app.use(express.json());

// ============ Middleware ============

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
}

// ============ Public Routes ============

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "SecureVault API is running" });
});

app.post("/echo", (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  res.json({
    echo: `you said: ${message}`,
  });
});

app.get("/public", (req: Request, res: Response) => {
  res.json({
    message: "This is public, anyone can access",
  });
});

// ============ Auth Routes ============

app.post("/register", async (req: Request, res: Response) => {
  const { email, masterPassword } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !masterPassword) {
    return res.status(400).json({ error: "Please provide full information" });
  }

  if (typeof email !== "string" || typeof masterPassword !== "string") {
    return res.status(400).json({ error: "Type error" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (masterPassword.length < 12) {
    return res.status(400).json({ error: "Minimum 12 length masterPassword" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User existed" });
  }

  const hasherPassword = await PasswordHasher.hash(masterPassword);

  const newUser = {
    id: Date.now().toString(),
    email,
    masterPasswordHash: hasherPassword,
    createdAt: new Date(),
  };

  users.push(newUser);

  res.status(201).json({
    message: "Registration successful",
    user: {
      id: newUser.id,
      email,
      createdAt: newUser.createdAt,
    },
  });
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, masterPassword } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !masterPassword) {
    return res.status(400).json({ error: "Please provide full information" });
  }

  if (typeof email !== "string" || typeof masterPassword !== "string") {
    return res.status(400).json({ error: "Type error" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isVerified = await PasswordHasher.verify(
    masterPassword,
    user.masterPasswordHash,
  );

  if (!isVerified) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, userEmail: user.email },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  res.status(200).json({
    message: "Login successful",
    token: token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

// ============ Protected Routes ============

app.get("/protected", authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;

  res.json({
    message: "You are authenticated!",
    user: {
      userId: user.userId,
      email: user.email,
    },
  });
});

app.get("/me", authenticateToken, (req: Request, res: Response) => {
  const decoded = (req as any).user;
  const user = users.find((u) => u.id === decoded.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  });
});

// ============ Server Start ============

app.listen(PORT, () => {
  console.log(`🔐 SecureVault API running on http://localhost:${PORT}`);
});
