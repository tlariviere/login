import type { UserId } from "@tlariviere/auth";
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import { Page, Title } from "../components/Page";
import { ErrorBox } from "../components/MessageBox";
import { LoadingBlock } from "../components/Loading";
import PwdRecoverForm from "../components/PwdRecoverForm";
import { fetchData } from "../utils/fetchHelpers";

interface Params {
  userId: UserId;
  token: string;
}

const PwdRecoverVerify: React.FC = () => {
  const { userId, token } = useParams<Params>();
  const { isLoading, isError, error } = useQuery(
    ["verify", userId, token],
    ({ signal }) =>
      fetchData(`/api/auth/pwd-recover/verify/${userId}/${token}`, { signal })
  );

  return (
    <Page>
      <Title>Reset your password</Title>

      {isLoading ? (
        <LoadingBlock />
      ) : isError ? (
        <ErrorBox small>{(error as Error).message}.</ErrorBox>
      ) : (
        <PwdRecoverForm userId={userId} token={token} />
      )}
    </Page>
  );
};

export default PwdRecoverVerify;
