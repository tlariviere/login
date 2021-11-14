import type { Optional } from "@tlariviere/utils";
import type { User } from "@tlariviere/auth";

import type { Roles } from "./roles";
import UserModel from "../model/user";

const updatePassword = async (
  user: User<Roles>,
  hashedNewPassword: string
): Promise<Optional<User<Roles>>> => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    user.id,
    { hashedPassword: hashedNewPassword },
    { new: true }
  ).lean({ virtuals: true });
  return updatedUser;
};

export default updatePassword;
