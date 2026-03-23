export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const account = typeof body?.account === "string" ? body.account.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const fieldErrors = {};

  if (!account) {
    fieldErrors.account = "請輸入帳號。";
  }

  if (!password) {
    fieldErrors.password = "請輸入密碼。";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "欄位驗證失敗",
      data: {
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
        formError: "帳號或密碼錯誤，請重新確認後再試。",
      },
    });
  }

  return {
    ok: true,
    redirectTo: "/",
  };
});
