import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function checkTokens(cookieStore) {
  const accessToken = cookieStore.get("access-token")?.value || null;
  const refreshToken = cookieStore.get("refresh-token")?.value || null;
  if (!accessToken) {
    return { valid: false, decoded: null };
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    return { valid: true, decoded };
  } catch (err) {
    //check if refresh token is present and valid
    if (!refreshToken) {
      return { valid: false, decoded: null };
    }
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return { valid: false, decoded: null };
    }
  }
  return { valid: true, decoded };
}
