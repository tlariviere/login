import MockTokenFamily from "./MockTokenFamily";

export default class MockTockenFamilies<Roles extends string> {
  public getOrCreate = jest.fn();
  public verifyAccessToken = jest.fn();
  public verifyRefreshToken = jest.fn();

  public constructor(tokenFamily: MockTokenFamily) {
    this.getOrCreate.mockReturnValue(tokenFamily);
  }

  public mockVerifyAccessToken(err: Error): void;
  public mockVerifyAccessToken(sub: string, role?: Roles): void;
  public mockVerifyAccessToken(subOrErr: string | Error, role?: Roles): void {
    if (subOrErr instanceof Error) {
      this.verifyAccessToken.mockImplementation(() => {
        throw subOrErr;
      });
    } else {
      this.verifyAccessToken.mockReturnValue({
        family: this.getOrCreate() as MockTokenFamily,
        body: { sub: subOrErr, role },
      });
    }
  }

  public mockVerifyAccessTokenOnce(err: Error): void;
  public mockVerifyAccessTokenOnce(sub: string, role?: Roles): void;
  public mockVerifyAccessTokenOnce(
    subOrErr: string | Error,
    role?: Roles
  ): void {
    if (subOrErr instanceof Error) {
      this.verifyAccessToken.mockImplementationOnce(() => {
        throw subOrErr;
      });
    } else {
      this.verifyAccessToken.mockReturnValueOnce({
        family: this.getOrCreate() as MockTokenFamily,
        body: { sub: subOrErr, role },
      });
    }
  }

  public mockVerifyRefreshToken(err: Error): void;
  public mockVerifyRefreshToken(sub: string, role?: Roles): void;
  public mockVerifyRefreshToken(subOrErr: string | Error, role?: Roles): void {
    if (subOrErr instanceof Error) {
      this.verifyRefreshToken.mockImplementation(() => {
        throw subOrErr;
      });
    } else {
      this.verifyRefreshToken.mockReturnValue({
        family: this.getOrCreate() as MockTokenFamily,
        body: { sub: subOrErr, role },
      });
    }
  }

  public mockVerifyRefreshTokenOnce(err: Error): void;
  public mockVerifyRefreshTokenOnce(sub: string, role?: Roles): void;
  public mockVerifyRefreshTokenOnce(
    subOrErr: string | Error,
    role?: Roles
  ): void {
    if (subOrErr instanceof Error) {
      this.verifyRefreshToken.mockImplementationOnce(() => {
        throw subOrErr;
      });
    } else {
      this.verifyRefreshToken.mockReturnValueOnce({
        family: this.getOrCreate() as MockTokenFamily,
        body: { sub: subOrErr, role },
      });
    }
  }

  public mockClear(): void {
    this.getOrCreate.mockClear();
    this.verifyAccessToken.mockClear();
    this.verifyRefreshToken.mockClear();
  }
}
