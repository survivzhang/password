import bcrypt from "bcrypt";

// Number of salt rounds (higher = more secure but slower)
// 10 is good balance for 2024
const SALT_ROUNDS = 10;

export class PasswordHasher {
  /**
   * Hash a password (one-way)
   * Used for master password storage
   */
  static async hash(password: string): Promise<string> {
    // bcrypt automatically generates salt and includes it in hash
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  }

  /**
   * Verify password against hash
   * Returns true if password matches
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  }
}
