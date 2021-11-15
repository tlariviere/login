import type { FormEventHandler } from "react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQueryClient, useMutation } from "react-query";

import { Page, Box, Title } from "../components/Page";
import {
  Label,
  Control,
  Form,
  FormSection,
  SubmitButton,
} from "../components/SignForm";
import { ErrorBox } from "../components/MessageBox";
import { fetchJson } from "../utils/fetchHelpers";
import "./SignIn.scss";

type SignInBody = {
  login: string;
  password: string;
};

const SignIn: React.FC = () => {
  const queryClient = useQueryClient();
  const loginState = useState("");
  const passwordState = useState("");
  const { isLoading, isError, error, mutate } = useMutation(
    (body: SignInBody) =>
      fetchJson("/api/auth/sign-in", { method: "POST", body }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData("userInfo", data);
      },
    }
  );

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    const [login] = loginState;
    const [password] = passwordState;
    mutate({ login, password });
  };

  return (
    <Page>
      <Title>Sign in to App</Title>

      {isError && <ErrorBox small>{(error as Error).message}.</ErrorBox>}

      <Box small>
        <Form onSubmit={onSubmit}>
          <FormSection>
            <Label htmlFor="login">Username or email address</Label>
            <Control
              type="text"
              id="login"
              autoComplete="username"
              state={loginState}
              required
            />
          </FormSection>

          <FormSection>
            <div className="d-flex justify-content-between">
              <Label htmlFor="password">Password</Label>
              <NavLink to="/pwd-recover" className="ForgottenPwd">
                Forgotten password?
              </NavLink>
            </div>
            <Control
              type="password"
              id="password"
              state={passwordState}
              required
            />
          </FormSection>

          <SubmitButton loading={isLoading}>Sign in</SubmitButton>
        </Form>
      </Box>

      <Box className="text-center" small>
        Don’t have an account? <NavLink to="/sign-up">Sign up</NavLink>
      </Box>
    </Page>
  );
};

export default SignIn;
