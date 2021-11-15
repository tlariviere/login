import React from "react";

import { Page, Title } from "./Page";

const Admin: React.FC = () => (
  <Page>
    <Title>Admin settings</Title>

    <p className="text-center mt-4">
      This page can only be accessed by admin users.
    </p>
  </Page>
);

export default Admin;
