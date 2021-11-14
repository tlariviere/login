import { RoleLevels } from "../../auth/utils/types";

export const roles = ["user", "admin"] as const;

type RolesTuple = typeof roles;
export type Roles = RolesTuple[Exclude<keyof RolesTuple, keyof number[]>];

export const roleLevels = Object.fromEntries(
  roles.map((role, index) => [role, index])
) as RoleLevels<Roles>;
