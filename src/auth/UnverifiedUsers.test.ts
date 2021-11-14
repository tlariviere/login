import { generateToken } from "./utils/jwt";
import UnverifiedUsers from "./UnverifiedUsers";

jest.useFakeTimers();
jest.mock("./utils/jwt");

describe("Token family", () => {
  const unverifiedUsers = new UnverifiedUsers();
  const username = "foo";
  const email = "foo@bar.com";
  const hashedPassword = "hash";
  const jti = "foobar";
  const mockGenerateToken = generateToken as jest.Mock<unknown, unknown[]>;

  beforeAll(() => {
    mockGenerateToken.mockReturnValue({
      body: { jti },
      compact: jest.fn(),
    });
  });

  beforeEach(() => {
    unverifiedUsers.clear();
  });

  test("generateUnverifiedUserToken should store user hashed password", () => {
    expect(unverifiedUsers.hashedPasswords.size).toBe(0);
    unverifiedUsers.generateUnverifiedUserToken(
      username,
      email,
      hashedPassword
    );
    expect(unverifiedUsers.hashedPasswords).toEqual(
      new Map([[jti, hashedPassword]])
    );
  });

  test("user data should be deleted after specified time", () => {
    unverifiedUsers.generateUnverifiedUserToken(
      username,
      email,
      hashedPassword
    );
    jest.runAllTimers();
    expect(unverifiedUsers.hashedPasswords.size).toBe(0);
  });

  test("take should give ownership of user data", () => {
    unverifiedUsers.generateUnverifiedUserToken(
      username,
      email,
      hashedPassword
    );
    const userData = unverifiedUsers.take(jti);
    expect(userData).toBe(hashedPassword);
    expect(unverifiedUsers.hashedPasswords.size).toBe(0);
  });
});
