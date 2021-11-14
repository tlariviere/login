import type { User } from "@tlariviere/auth";
import path from "path";
import ejs from "ejs";

import type { Roles } from "./roles";
import sendMail from "../sendMail";
import config from "../../constants/mail";

const sendPwdRecoverEmail = async (
  user: User<Roles>,
  urlOrigin: string,
  token: string
): Promise<void> => {
  const url = new URL(
    `/pwd-recover/verify/${user.id}/${token}`,
    urlOrigin
  ).toString();
  await sendMail({
    from: config.MAIL_FROM_ADDRESS,
    to: user.email,
    subject: "Reset your password",
    text: `Hi ${user.name} !\n\nPlease use this link to reset your password: ${url}`,
    html: await ejs.renderFile(
      path.resolve(__dirname, "../views/signUpMail.ejs"),
      {
        username: user.name,
        url,
      }
    ),
  });
};

export default sendPwdRecoverEmail;
