const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const account = typeof body?.account === "string" ? body.account.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const fieldErrors = {};

  if (!account) {
    fieldErrors.account = "請輸入帳號。";
  } else if (!EMAIL_PATTERN.test(account)) {
    fieldErrors.account = "請輸入有效的電子郵件地址。";
  }

  if (!password) {
    fieldErrors.password = "請輸入密碼。";
  } else if (password.length < 6) {
    fieldErrors.password = "密碼至少需要 6 碼。";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "欄位驗證失敗",
      data: {
        message: "欄位驗證失敗",
        formError: "請修正欄位內容後再試。",
        fieldErrors,
      },
    });
  }

  if (account === "timeout@example.com") {
    await new Promise((resolve) => setTimeout(resolve, 9000));
  }

  await new Promise((resolve) => setTimeout(resolve, 650));

  if (account !== "admin@example.com" || password !== "Admin123!") {
    throw createError({
      statusCode: 401,
      statusMessage: "帳號或密碼錯誤",
      data: {
        message: "帳號或密碼錯誤",
        formError: "帳號或密碼錯誤",
      },
    });
  }

  return {
    accessToken: "mock-jwt-token",
    user: {
      id: "u001",
      name: "Demo User",
      role: "admin",
    },
  };
});
