import njwt from "njwt";

/**
 * Verify token expiration date and signature.
 * @returns njwt Jwt object.
 */
export const verifyToken = (
  token: string,
  secret: string
): Promise<njwt.Jwt> => {
  return new Promise((resolve, reject) => {
    njwt.verify(
      token,
      secret,
      // @ts-ignore: Wrong type definition in njwt@1.1.0
      (err: Error | null, verifiedJwt: njwt.Jwt) => {
        if (err) {
          reject(err);
        } else {
          resolve(verifiedJwt);
        }
      }
    );
  });
};

/**
 * Generate json web token.
 * @param sub Token subject.
 * @param [claims] Other token body claims.
 * @returns njwt Jwt object.
 */
export const generateToken = (
  secret: string,
  lifetime: number,
  sub: string,
  claims: njwt.JSONMap = {}
): njwt.Jwt => {
  const jwt = njwt
    .create(claims, secret)
    .setExpiration(new Date().getTime() + lifetime);
  if (sub) {
    jwt.setSubject(sub);
  }
  return jwt;
};
