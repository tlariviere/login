import type { FormEventHandler } from "react";
import type { UserId } from "@tlariviere/login";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";

import { Box } from "./Page";
import { Label, Control, Form, FormSection, SubmitButton } from "./SignForm";
import { ErrorBox } from "./MessageBox";
import { fetchData } from "../utils/fetchHelpers";

type PwdRecoverBody = {
  userId: UserId;
  token: string;
  newPassword: string;
};

interface PwdRecoverFormProps {
  userId: UserId;
  token: string;
}

const PwdRecoverForm: React.FC<PwdRecoverFormProps> = ({ userId, token }) => {
  const history = useHistory();
  const newPasswordState = useState("");
  const { isLoading, isError, error, mutate } = useMutation(
    (body: PwdRecoverBody) =>
      fetchData("/api/auth/pwd-recover/update", { method: "POST", body }),
    { onSuccess: () => history.replace("/sign-in") }
  );

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    const [newPassword] = newPasswordState;
    mutate({ userId, token, newPassword });
  };

  return (
    <>
      {isError && <ErrorBox small>{(error as Error).message}.</ErrorBox>}

      <Box small>
        <Form onSubmit={onSubmit}>
          <FormSection>
            <Label htmlFor="newPassword">New password</Label>
            <Control
              type="password"
              id="newPassword"
              state={newPasswordState}
              required
            />
          </FormSection>

          <SubmitButton loading={isLoading}>Reset password</SubmitButton>
        </Form>
      </Box>
    </>
  );
};

export default PwdRecoverForm;
