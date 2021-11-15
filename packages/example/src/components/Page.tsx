import React from "react";

import WithClassNames from "./WithClassNames";
import "./Page.scss";

export const Page = WithClassNames("div", "Page");
export const Title = WithClassNames("h3", "text-center");

export interface BoxProps extends React.HTMLProps<HTMLDivElement> {
  small?: boolean;
}

export const Box: React.FC<BoxProps> = ({
  children,
  className: otherClassName,
  small = false,
  ...otherProps
}) => {
  const className = small ? "Box small" : "Box";
  return (
    <div
      className={otherClassName ? `${otherClassName} ${className}` : className}
      {...otherProps}
    >
      {children}
    </div>
  );
};
