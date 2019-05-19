import { verify } from "jsonwebtoken";

export const appSecret = process.env.APP_SECRET;

interface Token {
  userId: string;
}

export const getUserId = (context: any) => {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const verifiedToken = verify(token, appSecret) as Token;
    return verifiedToken && verifiedToken.userId;
  }
};
