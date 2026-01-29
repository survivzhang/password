import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PasswordHasher } from "./utils/crypto";
import pool from "./db";
import { deriveKey, encrypt, decrypt } from "./utils/encryption";

const app = express();
const PORT = 3000;
const JWT_SECRET = "this-is-the-secure-key-for-test";

// ============ Middleware ============
app.use(express.json());

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

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rows[0]) {
    return res.status(409).json({ error: "User existed" });
  }

  const hasherPassword = await PasswordHasher.hash(masterPassword);

  const result = await pool.query(
    "INSERT INTO users (email, master_password_hash) VALUES ($1, $2) RETURNING *",
    [email, hasherPassword],
  );

  const newUser = result.rows[0];

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

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isVerified = await PasswordHasher.verify(
    masterPassword,
    user.master_password_hash,
  );

  if (!isVerified) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const encryptionKey = deriveKey(masterPassword, email);

  const token = jwt.sign(
    {
      userId: user.id,
      userEmail: user.email,
      encryptionKey: encryptionKey.toString("hex"),
    },
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

app.post(
  "/passwords",
  authenticateToken,
  async (req: Request, res: Response) => {
    console.log(req);
    const decoded = (req as any).user;
    const encryptionKeyHex = decoded.encryptionKey;
    const userId = decoded.userId;
    const encryptionKey = Buffer.from(encryptionKeyHex, "hex");
    console.log(req.body);
    const { website, username, password, notes } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const { encrypted, iv, authTag } = encrypt(password, encryptionKey);
    const result = await pool.query(
      `
      INSERT INTO vault_items(
      user_id,
      website,
      username,
      encrypted_password,
      iv,
      auth_tag,
      notes
      )VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [userId, website, username, encrypted, iv, authTag, notes],
    );
    const newItem = result.rows[0];
    return res.status(201).json({
      message: "Password saved successfully",
      passwordItem: {
        id: newItem.id,
        website: newItem.website,
        username: newItem.username,
        notes: newItem.notes,
        createdAt: newItem.created_at,
      },
    });
  },
);

app.get(
  "/passwords",
  authenticateToken,
  async (req: Request, res: Response) => {
    const decoded = (req as any).user;
    const userId = decoded.userId;
    const result = await pool.query(
      `SELECT * FROM vault_items 
      WHERE user_id = $1
      ORDER BY created_at
      DESC
      `,
      [userId],
    );
    const passwords = result.rows.map((item) => ({
      id: item.id,
      website: item.website,
      username: item.username,
      notes: item.notes,
      createdAt: item.created_at,
    }));
    res.json({ passwords });
  },
);

app.get(
  "/passwords/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const decoded = (req as any).user;
    const passwordId = req.params.id;
    const encryptionKey = Buffer.from(decoded.encryptionKey, "hex");
    const result = await pool.query(
      `
    SELECT * FROM vault_items
    WHERE id = $1 AND user_id = $2
    `,
      [passwordId, decoded.userId],
    );
    const item = result.rows[0];
    if (!item) {
      return res.status(404).json("Password not found");
    }
    const password = decrypt(
      item.encrypted_password,
      encryptionKey,
      item.iv,
      item.auth_tag,
    );
    res.json({
      passwordItem: {
        id: item.id,
        website: item.website,
        username: item.username,
        notes: item.notes,
        createdAt: item.created_at,
      },
      decryptedPassword: password,
    });
  },
);

app.put(
  "/passwords/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const decoded = (req as any).user;
    const passwordId = req.params.id;
    const encryptionKey = Buffer.from(decoded.encryptionKey, "hex");
    const { website, username, password, notes } = req.body;
    const result = await pool.query(
      `
    SELECT * FROM vault_items
    WHERE id = $1 AND user_id = $2
    `,
      [passwordId, decoded.userId],
    );
    const item = result.rows[0];
    if (!item) {
      return res.status(404).json("Password not found");
    }
    let encrypted, iv, authTag;
    if (password) {
      const encryptResult = encrypt(password, encryptionKey);
      encrypted = encryptResult.encrypted;
      iv = encryptResult.iv;
      authTag = encryptResult.authTag;
    } else {
      encrypted = item.encrypted_password;
      iv = item.iv;
      authTag = item.auth_tag;
    }
    const updateResult = await pool.query(
      `
      UPDATE vault_items
      SET
        website = $1,
        username = $2,
        encrypted_password = $3,
        iv = $4,
        auth_tag = $5,
        notes = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING *
      `,
      [
        website || item.website,
        username || item.username,
        encrypted,
        iv,
        authTag,
        notes !== undefined ? notes : item.notes,
        passwordId,
        decoded.userId,
      ],
    );
    const updatedItem = updateResult.rows[0];

    if (!updatedItem) {
      return res.status(404).json({ error: "Password not found" });
    }
    res.json({
      message: "Password updated successfully",
      passwordItem: {
        id: updatedItem.id,
        website: updatedItem.website,
        username: updatedItem.username,
        notes: updatedItem.notes,
        createdAt: updatedItem.created_at,
        updatedAt: updatedItem.updated_at,
      },
    });
  },
);
app.delete(
  "/passwords/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const decoded = (req as any).user;
    const passwordId = req.params.id;
    const result = await pool.query(
      `
    DELETE FROM vault_items
    WHERE id = $1 AND user_id = $2
    `,
      [passwordId, decoded.userId],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Password not found" });
    }
    res.json({
      message: "Password deleted successfully",
    });
  },
);

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

app.get("/me", authenticateToken, async (req: Request, res: Response) => {
  const decoded = (req as any).user;
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [
    decoded.userId,
  ]);
  const user = result.rows[0];

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
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Connection failed:", err);
  } else {
    console.log("Connected Time:", res.rows[0].now);
  }
});

app.listen(PORT, () => {
  console.log(`🔐 SecureVault API running on http://localhost:${PORT}`);
});
