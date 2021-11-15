import React from "react";
import { BrowserRouter } from "react-router-dom";

import type { UserData } from "../utils/types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useQueryRequireLogin from "../hooks/useQueryRequireLogin";
import { fetchJson } from "../utils/fetchHelpers";

const App: React.FC = () => {
  const { isSuccess, data: user } = useQueryRequireLogin<UserData>(
    "userInfo",
    ({ signal }) => fetchJson("/api/user/info", { signal })
  );

  const isAdmin = isSuccess && (user as UserData).role === "admin";
  return (
    <BrowserRouter>
      <Header isSignedIn={isSuccess} isAdmin={isAdmin} />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
