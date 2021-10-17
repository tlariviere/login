import integerOr from "../utils/integerOr";

const config = {
  /**
   * Smtp host url.
   */
  MAIL_TRANSPORT_HOST: process.env.MAIL_TRANSPORT_HOST ?? "smtp.ethereal.email",

  /**
   * Smtp host port.
   */
  MAIL_TRANSPORT_PORT: integerOr(process.env.MAIL_TRANSPORT_PORT, 587),

  /**
   * Smtp host user name.
   */
  MAIL_TRANSPORT_USERNAME: process.env.MAIL_TRANSPORT_USERNAME,

  /**
   * Smtp host password.
   */
  MAIL_TRANSPORT_PASSWORD: process.env.MAIL_TRANSPORT_PASSWORD,

  /**
   * Mail sender address.
   */
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
};

export default config;
