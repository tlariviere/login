import type { HTMLProps, Dispatch, SetStateAction } from "react";
import React from "react";

import type { WithChildrenProps } from "../utils/types";
import WithClassNames from "./WithClassNames";
import { Loading } from "./Loading";

export const Label = WithClassNames("label", "form-label");

type ControlState = [string, Dispatch<SetStateAction<string>>];

interface ControlProps extends HTMLProps<HTMLInputElement> {
  state: ControlState;
}

export const Control: React.FC<ControlProps> = ({
  state: [value, setValue],
  ...otherProps
}) => (
  <input
    className="form-control"
    value={value}
    onChange={(event) => setValue(event.target.value)}
    {...otherProps}
  />
);

export const Form: React.FC<WithChildrenProps & HTMLProps<HTMLFormElement>> = ({
  children,
  ...otherProps
}) => (
  <form method="POST" className="d-grid py-2" {...otherProps}>
    {children}
  </form>
);

export const FormSection = WithClassNames("div", "mb-3");

interface SubmitButtonProps extends WithChildrenProps {
  loading?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  loading = false,
}) => {
  return loading ? (
    <button type="submit" className="btn btn-primary" disabled>
      <Loading />
    </button>
  ) : (
    <button type="submit" className="btn btn-primary">
      {children}
    </button>
  );
};
