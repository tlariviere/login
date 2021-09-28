import type { User } from "../types";

export default class MockFindUser<Roles extends string> {
  public byId = jest.fn();
  public byLogin = jest.fn();

  public mockResolvedUserIfMatch(user: User<Roles>): void {
    this.byId.mockImplementation((id) =>
      Promise.resolve(id === user.id ? user : undefined)
    );
    this.byLogin.mockImplementation((usernameOrEmail) =>
      Promise.resolve(
        usernameOrEmail === user.name || usernameOrEmail === user.email
          ? user
          : undefined
      )
    );
  }

  public mockResolvedUserIfMatchOnce(user: User<Roles>): void {
    this.byId.mockImplementationOnce((id) =>
      Promise.resolve(id === user.id ? user : undefined)
    );
    this.byLogin.mockImplementationOnce((usernameOrEmail) =>
      Promise.resolve(
        usernameOrEmail === user.name || usernameOrEmail === user.email
          ? user
          : undefined
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
  }
}
