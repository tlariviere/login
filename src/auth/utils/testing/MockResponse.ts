export default class MockResponse {
  public statusCode?: number;
  public status = jest.fn();
  public sendStatus = jest.fn();
  public send = jest.fn().mockReturnValue(this);
  public json = jest.fn().mockReturnValue(this);
  public cookie = jest.fn().mockReturnValue(this);
  public clearCookie = jest.fn().mockReturnValue(this);

  public constructor() {
    this.status.mockImplementation((statusCode: number) => {
      this.statusCode = statusCode;
      return this;
    });
    this.sendStatus.mockImplementation(<T>(statusCode: number, body: T) => {
      this.status(statusCode);
      this.send(body);
      return this;
    });
  }

  public mockClear(): void {
    delete this.statusCode;
    this.status.mockClear();
    this.sendStatus.mockClear();
    this.send.mockClear();
    this.json.mockClear();
    this.cookie.mockClear();
    this.clearCookie.mockClear();
  }
}
