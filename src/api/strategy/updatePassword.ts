import type { Optional } from "../../utils/types";
import type { User } from "../../auth/utils/types";
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
  ).lean();
  return updatedUser;
};

export default updatePassword;
