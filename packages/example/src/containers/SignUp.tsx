import type { FormEventHandler } from "react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation } from "react-query";

import type { Roles } from "../api/strategy/roles";
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

type SignUpBody = {
  username: string;
  email: string;
  password: string;
  role: Roles;
};

const SignUp: React.FC = () => {
  const usernameState = useState("");
  const emailState = useState("");
  const passwordState = useState("");
  const { isLoading, isError, isSuccess, error, mutate } = useMutation(
    (body: SignUpBody) =>
      fetchData("/api/auth/sign-up", { method: "POST", body })
  );
  const [email] = emailState;

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    const [username] = usernameState;
    const [password] = passwordState;
    mutate({
      username,
      email,
      password,
      role: "user",
    });
  };

  return (
    <Page>
      <Title>Create a new account</Title>

      {isSuccess ? (
        <SuccessBox>
          <p className="fs-6">
            Registration email sent to {email}. Please verify your email to
            finish sign-up.
          </p>
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
            <Form onSubmit={onSubmit}>
              <FormSection>
                <Label htmlFor="username">Username</Label>
                <Control
                  type="text"
                  id="username"
                  autoComplete="username"
                  state={usernameState}
                  required
                />
              </FormSection>

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

              <FormSection>
                <Label htmlFor="password">Password</Label>
                <Control
                  type="password"
                  id="password"
                  state={passwordState}
                  required
                />
              </FormSection>

              <SubmitButton loading={isLoading}>Sign Up</SubmitButton>
            </Form>
          </Box>

          <Box className="text-center" small>
            Already have an account? <NavLink to="/sign-in">Sign in</NavLink>
          </Box>
        </>
      )}
    </Page>
  );
};

export default SignUp;
