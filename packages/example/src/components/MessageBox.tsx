import React from "react";

import type { BoxProps } from "./Page";
import { Box } from "./Page";
import "./MessageBox.scss";

const MessageBox =
  (type: string, icon: string): React.FC<BoxProps> =>
  ({ children, ...otherProps }) =>
    (
      <Box className={`${type}Box`} {...otherProps}>
        <i className={`${type}Symbol bi bi-${icon}`} />
        <div>{children}</div>
      </Box>
    );

export const ErrorBox = MessageBox("Error", "x-square-fill");
export const WarningBox = MessageBox("Warning", "exclamation-triangle");
export const SuccessBox = MessageBox("Success", "check-lg");
