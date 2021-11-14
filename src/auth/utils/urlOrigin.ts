import type { Request } from "@tlariviere/utils";

const urlOrigin = (req: Request, port: number): string => {
  const url = new URL(`${req.protocol}://${req.hostname}`);
  // @ts-ignore: URL port may be a number or a string (https://nodejs.org/api/url.html#url_url_port)
  url.port = port;
  return url.toString();
};

export default urlOrigin;
