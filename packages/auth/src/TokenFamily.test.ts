import TokenValidity from "./TokenValidity";
import TokenFamily from "./TokenFamily";

describe("Token family", () => {
  const tokenFamily = new TokenFamily();
  const sub = "user";

  beforeEach(() => {
    tokenFamily.clear();
  });

  test("generateTokens should create valid token info objects", () => {
    expect(tokenFamily.lastRefreshToken).toBeUndefined();
    expect(tokenFamily.currentAccessToken).toBeUndefined();
    tokenFamily.generateTokens(sub);
    expect(tokenFamily.lastRefreshToken).not.toBeUndefined();
    expect(tokenFamily.currentAccessToken).not.toBeUndefined();
    expect(tokenFamily.lastRefreshToken?.isValid()).toBe(true);
    expect(tokenFamily.currentAccessToken?.isValid()).toBe(true);
  });

  test("generateTokens should invalid old refresh tokens", () => {
    tokenFamily.generateTokens(sub);
    const firstRefreshToken = tokenFamily.lastRefreshToken as TokenValidity;
    tokenFamily.generateTokens(sub);
    expect(firstRefreshToken.isValid()).toBe(false);
  });

  test("invalidate should invalidate last refresh and current access tokens", () => {
    tokenFamily.generateTokens(sub);
    const refreshToken = tokenFamily.lastRefreshToken as TokenValidity;
    const accessToken = tokenFamily.currentAccessToken as TokenValidity;
    tokenFamily.invalidate();
    expect(refreshToken.isValid()).toBe(false);
    expect(accessToken.isValid()).toBe(false);
  });

  test("checkRefreshTokenOrInvalidate should invalidate family on failure", () => {
    tokenFamily.generateTokens(sub);
    const refreshToken = tokenFamily.lastRefreshToken as TokenValidity;
    const accessToken = tokenFamily.currentAccessToken as TokenValidity;
    expect(
      tokenFamily.checkRefreshTokenOrInvalidate(`foo-${refreshToken.jti}`)
    ).toBe(false);
    expect(refreshToken.isValid()).toBe(false);
    expect(accessToken.isValid()).toBe(false);
  });
});
