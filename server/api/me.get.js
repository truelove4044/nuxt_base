const VALID_TOKEN = "mock-jwt-token";

function getBearerToken(authorizationHeader) {
  if (typeof authorizationHeader !== "string") {
    return "";
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return "";
  }

  return token.trim();
}

export default defineEventHandler((event) => {
  const authorizationToken = getBearerToken(getHeader(event, "authorization"));
  const cookieToken = getCookie(event, "auth_token") || "";
  const token = authorizationToken || cookieToken;

  if (token !== VALID_TOKEN) {
    throw createError({
      statusCode: 401,
      statusMessage: "登入已失效，請重新登入",
      data: {
        message: "登入已失效，請重新登入",
      },
    });
  }

  return {
    user: {
      id: "u001",
      name: "Demo User",
      role: "admin",
    },
  };
});
