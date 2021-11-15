import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import type { UserData } from "../utils/types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignUpVerify from "./SignUpVerify";
import UserInfo from "../components/UserInfo";
import Admin from "../components/Admin";
import useQueryRequireLogin from "../hooks/useQueryRequireLogin";
import { fetchJson } from "../utils/fetchHelpers";

const App: React.FC = () => {
  const {
    isSuccess,
    isFetched,
    data: user,
  } = useQueryRequireLogin<UserData>("userInfo", ({ signal }) =>
    fetchJson("/api/user/info", { signal })
  );

  const isAdmin = isSuccess && (user as UserData).role === "admin";
  return (
    <BrowserRouter>
      <Header isSignedIn={isSuccess} isAdmin={isAdmin} />

      <main className="flex-shrink-0 container">
        {isFetched && (
          <>
            {isSuccess ? (
              <Switch>
                <Route path="/user">
                  <UserInfo user={user as UserData} />
                </Route>
                {isAdmin && <Route path="/admin" component={Admin} />}
                <Route path="/sign-up/verify/:token" component={SignUpVerify} />
                <Route path="/">
                  <Redirect to="/user" />
                </Route>
              </Switch>
            ) : (
              <Switch>
                <Route path="/sign-in" component={SignIn} />
                <Route path="/sign-up/verify/:token" component={SignUpVerify} />
                <Route path="/sign-up" component={SignUp} />
                <Route path="/">
                  <Redirect to="/sign-in" />
                </Route>
              </Switch>
            )}
          </>
        )}
      </main>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
