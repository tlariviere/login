import type { User } from "../../auth/utils/types";
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
  return document.toObject();
};

export default createUser;
