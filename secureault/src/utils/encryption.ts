import crypto from "crypto";

export function deriveKey(masterPassword: string, email: string): Buffer {
  return crypto.pbkdf2Sync(masterPassword, email, 100000, 32, "sha256");
}

export function encrypt(text: string, key: Buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

export function decrypt(
  encrypted: string,
  key: Buffer,
  iv: string,
  authTag: string,
) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  let plaintext = decipher.update(encrypted, "hex", "utf8");
  plaintext += decipher.final("utf8");
  return plaintext;
}
