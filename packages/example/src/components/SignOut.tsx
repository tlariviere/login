import React from "react";
import { useQueryClient } from "react-query";

import useMutationRequireLogin from "../hooks/useMutationRequireLogin";
import { fetchData } from "../utils/fetchHelpers";
import "../styles/DarkButton.scss";

const SignOut: React.FC = () => {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutationRequireLogin(
    "sign-out",
    () => fetchData("/api/auth/sign-out", { method: "POST" }),
    { onSuccess: () => queryClient.resetQueries("userInfo", { exact: true }) }
  );

  return (
    <button
      type="button"
      className="DarkButton"
      onClick={() => mutate()}
      disabled={isLoading}
    >
      Sign out
    </button>
  );
};

export default SignOut;
