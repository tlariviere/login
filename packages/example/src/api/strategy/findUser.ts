import type { UserId, User } from "@tlariviere/auth";
import type { Optional } from "@tlariviere/utils";

import type { Roles } from "./roles";
import UserModel from "../model/user";

const findUserById = async (id: UserId): Promise<Optional<User<Roles>>> => {
  const user = await UserModel.findById(id).lean({ virtuals: true });
  return user;
};

const findUserByLogin = async (
  usernameOrEmail: string
): Promise<Optional<User<Roles>>> => {
  const user = await UserModel.findOne()
    .or([{ name: usernameOrEmail }, { email: usernameOrEmail }])
    .lean({ virtuals: true });
  return user;
};

export default { byId: findUserById, byLogin: findUserByLogin };
