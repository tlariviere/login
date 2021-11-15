import React from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const WithClassNames =
  <P extends Record<string, unknown>>(
    Component: React.ComponentType<P> | keyof JSX.IntrinsicElements,
    ...classNames: string[]
  ): React.FC<P & Props> =>
  ({ children, className: componentClassName, ...otherProps }) => {
    return (
      <Component
        className={(componentClassName
          ? [componentClassName, ...classNames]
          : classNames
        ).join(" ")}
        {...(otherProps as P)}
      >
        {children}
      </Component>
    );
  };

export default WithClassNames;
