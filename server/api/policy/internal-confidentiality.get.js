import { INTERNAL_CONFIDENTIALITY_POLICY } from "~~/shared/internal-confidentiality-policy.js";

const FALLBACK_TITLE = INTERNAL_CONFIDENTIALITY_POLICY.title;
const CHINESE_NUMBERS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function toChineseNumber(value) {
  if (value <= 10) {
    return value === 10 ? "十" : CHINESE_NUMBERS[value];
  }

  if (value < 20) {
    return `十${CHINESE_NUMBERS[value - 10]}`;
  }

  if (value < 100) {
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    return `${CHINESE_NUMBERS[tens]}十${ones ? CHINESE_NUMBERS[ones] : ""}`;
  }

  return String(value);
}

function withNumberLabel(articles) {
  return articles.map((article, index) => ({
    numberLabel: `第${toChineseNumber(index + 1)}條`,
    heading: article.heading || "",
    paragraphs: Array.isArray(article.paragraphs) ? article.paragraphs : [],
    items: Array.isArray(article.items) ? article.items : [],
  }));
}

export default defineEventHandler(async () => {
  try {
    const articles = withNumberLabel(INTERNAL_CONFIDENTIALITY_POLICY.articles || []);

    if (!articles.length) {
      throw new Error("policy parse failed");
    }

    return {
      title: INTERNAL_CONFIDENTIALITY_POLICY.title || FALLBACK_TITLE,
      articles,
    };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "無法讀取保密與隱私條款",
      data: {
        message: "目前無法載入保密與隱私條款，請稍後再試。",
      },
    });
  }
});
