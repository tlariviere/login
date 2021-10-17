import sendMail from "../sendMail";
import config from "../../constants/mail";

const sendPwdRecoverEmail = async (
  username: string,
  email: string,
  url: string
): Promise<void> => {
  await sendMail({
    from: config.MAIL_FROM_ADDRESS,
    to: email,
    subject: "Reset your password",
    text: `Hi ${username} !\n\nPlease use this link to reset your password: ${url}`,
  });
};

export default sendPwdRecoverEmail;
