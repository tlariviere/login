const exitWithError = (message: string, code = 1): void => {
  console.error(message);
  process.exit(code);
};

export default exitWithError;
