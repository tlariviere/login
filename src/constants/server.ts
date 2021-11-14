import { integerOr } from "@tlariviere/utils";

const config = {
  /**
   * Server url port.
   */
  PORT: integerOr(process.env.PORT, 8080),
};

export default config;
