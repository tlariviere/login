import type { UserUnprotectedData } from "@tlariviere/auth";
import React from "react";

import type { Roles } from "../api/strategy/roles";
import { Page, Box, Title } from "./Page";
import avatar from "../assets/user.svg";
import "./UserInfo.scss";

interface UserInfoProps {
  user: UserUnprotectedData<Roles>;
}

const roleDisplayName: Record<Roles, string> = {
  user: "Member",
  admin: "Admin",
};

const UserInfo: React.FC<UserInfoProps> = ({ user }) => (
  <Page>
    <Title>Your profile</Title>

    <Box className="UserInfo">
      <div>
        <img className="Avatar" src={avatar} alt="user avatar" />
        <div>
          <p className="Name">{user.name}</p>
          <p className="Email">{user.email}</p>
          {user.role && <p className="Role">{roleDisplayName[user.role]}</p>}
        </div>
      </div>
    </Box>
  </Page>
);

export default UserInfo;
