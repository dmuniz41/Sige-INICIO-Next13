import jwt, { JwtPayload } from "jsonwebtoken";

interface SigInOptions {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTIONS = {
  expiresIn: "8h",
};

export function signJwtAccessToken(payload: JwtPayload, options: SigInOptions = DEFAULT_SIGN_OPTIONS) {
  try {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const token = jwt.sign(payload, secretKey!, options);
    return token;
  } catch (error) {
  console.log("🚀 ~ file: jwt.ts:18 ~ signJwtAccessToken ~ error:", error)
  }
}

export function verifyJWT(token: string) {
  try {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const decoded = jwt.verify(token, secretKey!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log("🚀 ~ file: jwt.ts:24 ~ verifyJWT ~ error:", error);
    return null;
  }
}
