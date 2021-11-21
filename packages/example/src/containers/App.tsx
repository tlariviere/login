import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import type { UserData } from "../utils/types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserInfo from "../components/UserInfo";
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

      <main className="flex-shrink-0 container">
        {isSuccess && (
          <Switch>
            <Route path="/user">
              <UserInfo user={user as UserData} />
            </Route>
            <Route path="/">
              <Redirect to="/user" />
            </Route>
          </Switch>
        )}
      </main>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
