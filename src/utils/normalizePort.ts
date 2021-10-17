/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: string): string | number | boolean => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

export default normalizePort;
