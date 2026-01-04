import express, { Request, Response } from "express";
import { PasswordHasher } from "./utils/crypto";

const app = express();
const PORT = 3000;
const users: any[] = [];

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "SecureVault API is running" });
});

app.listen(PORT, () => {
  console.log(`🔐 SecureVault API running on http://localhost:${PORT}`);
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
  console.log("newUser.id:", newUser.id);
  users.push(newUser);
  // TODO: Add password validation and registration logic
  res.status(201).json({
    message: "Registration successful",
    user: {
      id: newUser.id,
      email,
      createdAt: newUser.createdAt,
    },
  });
});
