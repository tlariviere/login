import findUser from "./findUser";
import createUser from "./createUser";
import updatePassword from "./updatePassword";
import sendSignUpEmail from "./sendSignUpEmail";
import sendPwdRecoverEmail from "./sendPwdRecoverEmail";

const strategy = {
  findUser,
  createUser,
  updatePassword,
  sendSignUpEmail,
  sendPwdRecoverEmail,
};

export default strategy;
