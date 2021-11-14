import { integerOr } from "@tlariviere/utils";

const config = {
  MAIL_TRANSPORT_HOST: process.env.MAIL_TRANSPORT_HOST ?? "smtp.ethereal.email",
  MAIL_TRANSPORT_PORT: integerOr(process.env.MAIL_TRANSPORT_PORT, 587),
  MAIL_TRANSPORT_USERNAME: process.env.MAIL_TRANSPORT_USERNAME,
  MAIL_TRANSPORT_PASSWORD: process.env.MAIL_TRANSPORT_PASSWORD,
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
};

export default config;
