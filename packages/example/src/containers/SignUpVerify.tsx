import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQueryClient, useQuery } from "react-query";

import type { UserData } from "../utils/types";
import { Page } from "../components/Page";
import { ErrorBox, SuccessBox } from "../components/MessageBox";
import { LoadingBlock } from "../components/Loading";
import { fetchJson } from "../utils/fetchHelpers";

const SignUpVerify: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const history = useHistory();
  const queryClient = useQueryClient();
  const isUserSignedIn =
    queryClient.getQueryData("userInfo", { exact: true }) !== undefined;
  const { isError, isSuccess, error, data } = useQuery<UserData>(
    ["verify", token],
    ({ signal }) =>
      fetchJson(`/api/auth/sign-up/verify/${token}`, {
        method: "POST",
        signal,
      }),
    {
      enabled: !isUserSignedIn,
      onSuccess: (info) => {
        queryClient.setQueryData("userInfo", info);
      },
    }
  );

  useEffect(() => {
    if (isUserSignedIn) {
      const redirect = () => history.replace("/user");
      /**
       * Redirect to /user after 3 seconds on normal flow
       * or instantly if user was already signed in.
       */
      if (isSuccess) {
        setTimeout(redirect, 3000);
      } else {
        redirect();
      }
    }
  }, [isUserSignedIn, history, isSuccess]);

  return (
    <Page>
      {isSuccess ? (
        <SuccessBox>
          Welcome {(data as UserData).name} ! Your account has been registered
          successfully !
        </SuccessBox>
      ) : isError ? (
        <ErrorBox small>{(error as Error).message}.</ErrorBox>
      ) : (
        <LoadingBlock />
      )}
    </Page>
  );
};

export default SignUpVerify;
