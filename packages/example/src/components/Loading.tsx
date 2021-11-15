import React from "react";

export const Loading: React.FC = () => (
  <>
    <span
      className="spinner-border spinner-border-sm me-2"
      role="status"
      aria-hidden="true"
    />
    Loading...
  </>
);

export const LoadingBlock: React.FC = () => (
  <div className="text-center m-5">
    <Loading />
  </div>
);
