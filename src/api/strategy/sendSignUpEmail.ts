import sendMail from "../sendMail";
import config from "../../constants/mail";

const sendSignUpEmail = async (
  username: string,
  email: string,
  url: string
): Promise<void> => {
  await sendMail({
    from: config.MAIL_FROM_ADDRESS,
    to: email,
    subject: "Complete your registration",
    text: `Welcome ${username} !\n\nTo complete your sign up, please click the link here: ${url}`,
  });
};

export default sendSignUpEmail;
