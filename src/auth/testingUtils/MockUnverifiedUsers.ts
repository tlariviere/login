export default class MockUnverifiedUsers {
  public take = jest.fn();
  public generateUnverifiedUserToken = jest.fn();

  public constructor(token?: string) {
    if (token) {
      this.generateUnverifiedUserToken.mockReturnValue(token);
    }
  }

  public mockClear(): void {
    this.take.mockClear();
    this.generateUnverifiedUserToken.mockClear();
  }
}
