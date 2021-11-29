import type { User } from "../types";

export default class MockFindUser<Roles extends string> {
  public byId = jest.fn();
  public byLogin = jest.fn();

  public constructor() {
    this.mockReset();
  }

  public mockResolvedUserIfMatch(user: User<Roles>): void {
    this.byId.mockImplementation((id) =>
      Promise.resolve(id === user.id ? user : null)
    );
    this.byLogin.mockImplementation((usernameOrEmail) =>
      Promise.resolve(
        usernameOrEmail === user.name || usernameOrEmail === user.email
          ? user
          : null
      )
    );
  }

  public mockClear(): void {
    this.byId.mockClear();
    this.byLogin.mockClear();
  }

  public mockReset(): void {
    this.byId.mockReset();
    this.byLogin.mockReset();
    this.byId.mockResolvedValue(null);
    this.byLogin.mockResolvedValue(null);
  }
}
