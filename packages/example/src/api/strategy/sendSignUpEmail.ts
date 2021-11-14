import path from "path";
import ejs from "ejs";

import sendMail from "../sendMail";
import config from "../../constants/mail";

const sendSignUpEmail = async (
  username: string,
  email: string,
  urlOrigin: string,
  token: string
): Promise<void> => {
  const url = new URL(`/sign-up/verify/${token}`, urlOrigin).toString();
  await sendMail({
    from: config.MAIL_FROM_ADDRESS,
    to: email,
    subject: "Complete your registration",
    text: `Welcome ${username} !\n\nTo complete your sign up, please click the link here: ${url}`,
    html: await ejs.renderFile(
      path.resolve(__dirname, "../views/signUpMail.ejs"),
      {
        username,
        url,
      }
    ),
  });
};

export default sendSignUpEmail;
