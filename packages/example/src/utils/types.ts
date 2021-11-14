// ===========================================================================
// Error
// ===========================================================================

export interface NodeError extends Error {
  code: string;
}

export interface SystemError extends NodeError {
  syscall: string;
}

export const isSystemError = (error: NodeError): error is SystemError => {
  return (error as SystemError).syscall !== undefined;
};
