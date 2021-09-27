import "./TokenFamily";
import { verifyToken } from "./jwt";
import TokenFamilies from "./TokenFamilies";

jest.useFakeTimers();

const mockTokenFamilyClear = jest.fn();
const mockIsAccessTokenValid = jest.fn();
const mockCheckRefreshTokenOrInvalidate = jest.fn();
jest.mock("./TokenFamily", () =>
  jest.fn().mockImplementation(() => ({
    isAccessTokenValid: mockIsAccessTokenValid,
    checkRefreshTokenOrInvalidate: mockCheckRefreshTokenOrInvalidate,
    clear: mockTokenFamilyClear,
  }))
);
jest.mock("./jwt");

describe("Token family", () => {
  const tokenFamilies = new TokenFamilies();
  const userId = "01234";
  const mockVerifyToken = verifyToken as jest.Mock<Promise<unknown>, unknown[]>;
  const token = {
    body: {
      sub: userId,
      jti: "foobar",
    },
  };

  beforeAll(() => {
    mockVerifyToken.mockResolvedValue(token);
    mockIsAccessTokenValid.mockReturnValue(true);
    mockCheckRefreshTokenOrInvalidate.mockReturnValue(true);
  });

  beforeEach(() => {
    tokenFamilies.clear();
    mockTokenFamilyClear.mockClear();
  });

  test("getOrCreate should create family if it does not exists", () => {
    expect(tokenFamilies.families.size).toBe(0);
    const family = tokenFamilies.getOrCreate(userId);
    expect(tokenFamilies.families).toEqual(new Map([[userId, family]]));
  });

  test("getOrCreate should return family if it exists", () => {
    const family = tokenFamilies.getOrCreate(userId);
    const newFamily = tokenFamilies.getOrCreate(userId);
    expect(newFamily).toBe(family);
    expect(tokenFamilies.families).toEqual(new Map([[userId, family]]));
  });

  test("families should be cleared after specified time", () => {
    tokenFamilies.getOrCreate(userId);
    jest.runAllTimers();
    expect(mockTokenFamilyClear).toHaveBeenCalled();
  });

  test("verifyAccessToken should throw if family token doesn't exist", async () => {
    await expect(() =>
      tokenFamilies.verifyAccessToken("token")
    ).rejects.toThrow("Access token invalidated");
  });

  test("verifyAccessToken should throw if family access token has been invalidated", async () => {
    tokenFamilies.getOrCreate(userId);
    mockIsAccessTokenValid.mockReturnValueOnce(false);
    await expect(() =>
      tokenFamilies.verifyAccessToken("token")
    ).rejects.toThrow("Access token invalidated");
  });

  test("verifyRefreshToken should throw if family token doesn't exist", async () => {
    await expect(() =>
      tokenFamilies.verifyRefreshToken("token")
    ).rejects.toThrow("Refresh token invalidated");
  });

  test("verifyRefreshToken should throw if family refresh token has been invalidated", async () => {
    tokenFamilies.getOrCreate(userId);
    mockCheckRefreshTokenOrInvalidate.mockReturnValueOnce(false);
    await expect(() =>
      tokenFamilies.verifyRefreshToken("token")
    ).rejects.toThrow("Refresh token invalidated");
  });
});
