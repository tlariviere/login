import type { CompactedToken, TokenBody } from "./utils/types";
import CircularArray from "./utils/CircularArray";
import TokenValidity from "./TokenValidity";
import { generateToken } from "./utils/jwt";
import config from "./constants/token";

export interface TokenCouple {
  accessToken: CompactedToken;
  refreshToken: CompactedToken;
}

/**
 * Token family helper class to implement token replay detection for refresh token rotation.
 * Store up to `maxLength` latest refresh tokens and latest access token.
 */
export default class TokenFamily<Roles extends string> {
  private refreshTokens_: CircularArray<TokenValidity>;
  private jtiToRefreshToken_: Map<string, TokenValidity>;
  private currentAccessToken_?: TokenValidity;

  public constructor() {
    this.refreshTokens_ = new CircularArray(config.TOKEN_FAMILY_MAX_LENGTH);
    this.jtiToRefreshToken_ = new Map();
  }

  /**
   * @returns Last refresh token or undefined if family is empty.
   */
  public get lastRefreshToken(): TokenValidity | undefined {
    return this.refreshTokens_.back();
  }

  /**
   * @returns Current access token if any, undefined otherwise.
   */
  public get currentAccessToken(): TokenValidity | undefined {
    return this.currentAccessToken_;
  }

  /**
   * Generate access and refresh token couple.
   * @param sub Token subject.
   * @param [role] User role.
   */
  public generateTokens(sub: string, role?: Roles): TokenCouple {
    return {
      accessToken: this.generateAccessToken_(sub, role),
      refreshToken: this.generateRefreshToken_(sub, role),
    };
  }

  /**
   * Invalidate all refresh and access tokens.
   */
  public invalidate(): void {
    this.lastRefreshToken?.invalidate();
    this.currentAccessToken_?.invalidate();
  }

  /**
   * Check access token validity.
   * @param jti Token id.
   */
  public isAccessTokenValid(jti: string): boolean {
    return (
      !this.currentAccessToken_ ||
      !this.currentAccessToken_.isValid() ||
      jti !== this.currentAccessToken_.jti
    );
  }

  /**
   * Check refresh token validity. Invalidate token family if invalid.
   * @param jti Token id.
   */
  public checkRefreshTokenOrInvalidate(jti: string): boolean {
    const tokenValidity = this.jtiToRefreshToken_.get(jti);
    if (!tokenValidity || !tokenValidity.isValid()) {
      // Suspicious refresh token usage: invalidate family
      this.invalidate();
      return false;
    }
    return true;
  }

  /**
   * Clear all tokens.
   */
  public clear(): void {
    this.refreshTokens_.clear();
    this.jtiToRefreshToken_.clear();
    delete this.currentAccessToken_;
  }

  private generateAccessToken_(sub: string, role?: Roles): CompactedToken {
    const token = generateToken(
      config.ACCESS_TOKEN_SECRET,
      config.ACCESS_TOKEN_LIFETIME,
      sub,
      role ? { role } : {}
    );
    const { jti } = token.body as TokenBody;
    this.currentAccessToken_ = new TokenValidity(jti);
    return token.compact();
  }

  private generateRefreshToken_(sub: string, role?: Roles): CompactedToken {
    const token = generateToken(
      config.REFRESH_TOKEN_SECRET,
      config.REFRESH_TOKEN_LIFETIME,
      sub,
      role ? { role } : {}
    );
    const lastToken = this.refreshTokens_.back();
    if (lastToken) {
      lastToken.invalidate();
    }
    const { jti } = token.body as TokenBody;
    const tokenValidity = new TokenValidity(jti);
    const oldestToken = this.refreshTokens_.pushOrReplace(tokenValidity);
    if (oldestToken) {
      this.jtiToRefreshToken_.delete(oldestToken.jti);
    }
    this.jtiToRefreshToken_.set(jti, tokenValidity);
    return token.compact();
  }
}
