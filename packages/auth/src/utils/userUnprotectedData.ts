import type { User, UserUnprotectedData } from "./types";

/**
 * Filter out sensible user data.
 */
const userUnprotectedData = <Roles extends string>(
  user: User<Roles>
): UserUnprotectedData<Roles> => {
  return { name: user.name, email: user.email, role: user.role };
};

export default userUnprotectedData;
