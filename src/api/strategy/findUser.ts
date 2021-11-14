import type { Optional } from "@tlariviere/utils";

import type { UserId, User } from "../../auth/utils/types";
import type { Roles } from "./roles";
import UserModel from "../model/user";

const findUserById = async (id: UserId): Promise<Optional<User<Roles>>> => {
  const user = await UserModel.findById(id).lean();
  console.log(user);
  return user;
};

const findUserByLogin = async (
  usernameOrEmail: string
): Promise<Optional<User<Roles>>> => {
  const user = await UserModel.findOne()
    .or([{ name: usernameOrEmail }, { email: usernameOrEmail }])
    .lean();
  console.log(user);
  return user;
};

export default { byId: findUserById, byLogin: findUserByLogin };
