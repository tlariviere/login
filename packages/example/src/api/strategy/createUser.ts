import type { User } from "@tlariviere/login";

import type { Roles } from "./roles";
import UserModel from "../model/user";

const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
  role?: Roles
): Promise<User<Roles>> => {
  const document = await new UserModel({
    name,
    email,
    hashedPassword,
    role,
  }).save();
  return document.toObject({ virtuals: true });
};

export default createUser;
