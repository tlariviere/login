import path from "path";
import { integerOr } from "@tlariviere/utils";

const config = {
  PORT: integerOr(process.env.PORT, 8080),

  TLS_KEY_PATH:
    process.env.TLS_KEY_PATH ??
    path.resolve(__dirname, "../../sslcert/server.key"),

  TLS_CERT_PATH:
    process.env.TLS_CERT_PATH ??
    path.resolve(__dirname, "../../sslcert/server.cert"),
};

export default config;
