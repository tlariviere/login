import type { CompactedToken, TokenBody } from "../utils/types";
import { generateToken } from "./jwt";
import config from "../constants/token";

/**
 * Container for unverified users.
 * Unverified users are newly signed-up users that did not verified their email yet.
 */
export default class UnverifiedUsers<Roles extends string> {
  private userHashedPasswords_: Map<string, string> = new Map();

  /**
   * @returns Map of all unverified user hashed passwords indexed by token id (jti).
   */
  public get hashedPasswords(): ReadonlyMap<string, string> {
    return this.userHashedPasswords_;
  }

  /**
   * Look for unverified user associated with given token id.
   * If found, delete entry in container and return user hashed password.
   * @param jti Token id.
   * @returns User hashed password if found or undefined.
   */
  public take(jti: string): string | undefined {
    const user = this.userHashedPasswords_.get(jti);
    this.deleteUser(jti);
    return user;
  }

  /**
   * Generate token and register unverified user in container.
   * User will be automatically deleted from container when token expires.
   */
  public generateUnverifiedUserToken(
    username: string,
    email: string,
    hashedPassword: string,
    role?: Roles
  ): CompactedToken {
    const token = generateToken(
      config.SIGN_UP_TOKEN_SECRET,
      config.SIGN_UP_TOKEN_LIFETIME,
      username,
      role ? { email, role } : { email }
    );
    const { jti } = token.body as TokenBody;
    this.userHashedPasswords_.set(jti, hashedPassword);
    setTimeout(() => this.deleteUser(jti), config.SIGN_UP_TOKEN_LIFETIME);
    return token.compact();
  }

  public deleteUser(jti: string): void {
    this.userHashedPasswords_.delete(jti);
  }

  public clear(): void {
    this.userHashedPasswords_.clear();
  }
}
