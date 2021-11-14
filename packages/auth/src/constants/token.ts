import secureRandom from "secure-random-string";
import { integerOr } from "@tlariviere/utils";

const secretLength = integerOr(process.env.SECRET_LENGTH, 256);

const config = {
  /**
   * Number of password hash rounds.
   */
  PASSWORD_HASH_ROUNDS: integerOr(process.env.PASSWORD_HASH_ROUNDS, 10),

  /**
   * Sign-up token time before expiration.
   */
  SIGN_UP_TOKEN_LIFETIME: integerOr(
    process.env.SIGN_UP_TOKEN_LIFETIME,
    600000 // 10 minutes
  ),
  SIGN_UP_TOKEN_SECRET: secureRandom({ length: secretLength }),

  /**
   * Access token time before expiration.
   */
  ACCESS_TOKEN_LIFETIME: integerOr(
    process.env.ACCESS_TOKEN_LIFETIME,
    1800000 // 30 minutes
  ),
  ACCESS_TOKEN_SECRET: secureRandom({ length: secretLength }),

  /**
   * Refresh token time before expiration.
   */
  REFRESH_TOKEN_LIFETIME: integerOr(
    process.env.REFRESH_TOKEN_LIFETIME,
    1296000000 // 15 days
  ),
  REFRESH_TOKEN_SECRET: secureRandom({ length: secretLength }),

  /**
   * Password recovery token time before expiration.
   */
  PWD_RECOVER_TOKEN_LIFETIME: integerOr(
    process.env.PWD_RECOVER_TOKEN_LIFETIME,
    600000 // 10 minutes
  ),

  /**
   * Maximum number of stored refresh token per token family (one family per logged user).
   */
  TOKEN_FAMILY_MAX_LENGTH: integerOr(process.env.TOKEN_FAMILY_MAX_LENGTH, 20),

  /**
   * Token family time before expiration.
   * User will be asked to log again even if its refresh token remains valid.
   */
  TOKEN_FAMILY_LIFETIME: integerOr(
    process.env.TOKEN_FAMILY_ABSOLUTE_LIFETIME,
    31557600000 // 1 year
  ),
};

export default config;
