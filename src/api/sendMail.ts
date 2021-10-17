import type { SendMailOptions } from "nodemailer";
import type { Address } from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";

import exitWithError from "../utils/exitWithError";
import config from "../constants/mail";

const createTestAccount =
  config.MAIL_TRANSPORT_HOST === "smtp.ethereal.email" &&
  (!config.MAIL_TRANSPORT_USERNAME || !config.MAIL_TRANSPORT_PASSWORD);

const transporter = (async () => {
  try {
    let user: string | undefined;
    let pass: string | undefined;

    if (createTestAccount) {
      ({ user, pass } = await nodemailer.createTestAccount());
    } else {
      user = config.MAIL_TRANSPORT_USERNAME;
      pass = config.MAIL_TRANSPORT_PASSWORD;
    }

    return nodemailer.createTransport({
      host: config.MAIL_TRANSPORT_HOST,
      port: config.MAIL_TRANSPORT_PORT,
      secure: config.MAIL_TRANSPORT_PORT === 465,
      auth: { user, pass },
    });
  } catch (err) {
    return exitWithError(
      `Failed to create mail transporter '${config.MAIL_TRANSPORT_HOST}': ${
        (err as Error).message
      }`
    );
  }
})();

const formatAddress = (
  address?: string | Address | Array<string | Address>
): string => {
  if (address) {
    if (Array.isArray(address)) {
      return address.map(formatAddress).join(", ");
    }

    return typeof address === "string"
      ? address
      : `${address.name} <${address.address}>`;
  }
  return "";
};

const sendMail = async (options: SendMailOptions): Promise<void> => {
  const resolvedTransporter = await transporter;
  if (!resolvedTransporter) {
    throw new Error("Invalid mail transporter");
  }

  const info = await resolvedTransporter.sendMail(options);

  if (createTestAccount) {
    console.log(
      `Email: from '${formatAddress(options.from)}' to '${formatAddress(
        options.to
      )}'\nsubject: '${options.subject ?? ""}'\npreview url: '${
        nodemailer.getTestMessageUrl(info) as string
      }'`
    );
  }
};

export default sendMail;
