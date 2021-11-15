import type { FormEventHandler } from "react";
import React, { useState } from "react";
import { useMutation } from "react-query";

import { Page, Box, Title } from "../components/Page";
import {
  Label,
  Control,
  Form,
  FormSection,
  SubmitButton,
} from "../components/SignForm";
import { ErrorBox, SuccessBox } from "../components/MessageBox";
import { fetchData } from "../utils/fetchHelpers";

type PwdRecoverBody = {
  email: string;
};

const PwdRecover: React.FC = () => {
  const emailState = useState("");
  const { isLoading, isError, isSuccess, error, mutate } = useMutation(
    (body: PwdRecoverBody) =>
      fetchData("/api/auth/pwd-recover", { method: "POST", body })
  );
  const [email] = emailState;

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    mutate({ email });
  };

  return (
    <Page>
      <Title>Reset your password</Title>

      {isSuccess ? (
        <SuccessBox>
          <p className="fs-6">Password recovery email sent to {email}.</p>
          <p>
            If you don&apos;t see this email in your inbox within 15 minutes,
            look for it in your junk mail folder. If you find it there please
            mark the email as &quot;Not junk&quot;.
          </p>
        </SuccessBox>
      ) : (
        <>
          {isError && <ErrorBox small>{(error as Error).message}.</ErrorBox>}

          <Box small>
            <p>
              Enter your email address and we’ll send you a password reset link.
            </p>
            <Form onSubmit={onSubmit}>
              <FormSection>
                <Label htmlFor="email">Email address</Label>
                <Control
                  type="email"
                  id="email"
                  autoComplete="email"
                  state={emailState}
                  required
                />
              </FormSection>

              <SubmitButton loading={isLoading}>
                Send password reset email
              </SubmitButton>
            </Form>
          </Box>
        </>
      )}
    </Page>
  );
};

export default PwdRecover;
