import type { UserId, AuthTokenBody, JwtAuthData } from "./utils/types";
import TokenFamily from "./TokenFamily";
import config from "./constants/token";
import { verifyToken } from "./utils/jwt";

/**
 * Container that associate a token families per user.
 */
export default class TokenFamilies<Roles extends string> {
  private families_: Map<UserId, TokenFamily<Roles>> = new Map();

  /**
   * @returns Map of all token families indexed by user id.
   */
  public get families(): ReadonlyMap<UserId, TokenFamily<Roles>> {
    return this.families_;
  }

  /**
   * @returns Token family associated with given user id.
   *    If not found, a new family is created.
   */
  public getOrCreate(userId: UserId): TokenFamily<Roles> {
    let family = this.families_.get(userId);
    if (!family) {
      family = new TokenFamily();
      this.families_.set(userId, family);
      setTimeout(() => family?.clear(), config.TOKEN_FAMILY_LIFETIME);
    }
    return family;
  }

  /**
   * Parse and verify access token.
   * Throws on invalid or expired token or if token has been invalidated in its family.
   * @returns Token header, body and family.
   */
  public async verifyAccessToken(token: string): Promise<JwtAuthData<Roles>> {
    const jwt = await verifyToken(token, config.ACCESS_TOKEN_SECRET);
    const body = jwt.body as AuthTokenBody<Roles>;
    const { sub: userId, jti } = body;
    const family = this.families_.get(userId);
    if (!family || !family.isAccessTokenValid(jti)) {
      throw new Error("Access token invalidated");
    }
    return { header: jwt.header, body, family };
  }

  /**
   * Parse and verify refresh token.
   * Throws on invalid or expired token or if token has been invalidated in its family.
   * @returns Token header, body and family.
   */
  public async verifyRefreshToken(token: string): Promise<JwtAuthData<Roles>> {
    const jwt = await verifyToken(token, config.REFRESH_TOKEN_SECRET);
    const body = jwt.body as AuthTokenBody<Roles>;
    const { sub: userId, jti } = body;
    const family = this.families_.get(userId);
    if (!family || !family.checkRefreshTokenOrInvalidate(jti)) {
      throw new Error("Refresh token invalidated");
    }
    return { header: jwt.header, body, family };
  }

  /**
   * Delete all token families.
   */
  public clear(): void {
    this.families_.clear();
  }
}
