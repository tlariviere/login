export default class MockTockenFamily {
  public generateTokens = jest.fn();
  public invalidate = jest.fn();
  public clear = jest.fn();

  public constructor();
  public constructor(accessToken: string, refreshToken: string);
  public constructor(accessToken?: string, refreshToken?: string) {
    if (accessToken && refreshToken) {
      this.generateTokens.mockReturnValue({ accessToken, refreshToken });
    }
  }

  public mockClear(): void {
    this.generateTokens.mockClear();
    this.invalidate.mockClear();
    this.clear.mockClear();
  }
}
