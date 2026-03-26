import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const POLICY_PATH = resolve(
  process.cwd(),
  "docs/internal_confidentiality_privacy_policy.md",
);
const FALLBACK_TITLE = "公司內部系統保密與隱私條款";
const CHINESE_NUMBERS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function parseTitle(content) {
  const firstLine = content.split("\n").find((line) => line.trim().length > 0);
  if (!firstLine) {
    return FALLBACK_TITLE;
  }

  const normalized = firstLine.replace(/^#\s*/, "").trim();
  return normalized || FALLBACK_TITLE;
}

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

function sanitizeLine(value) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\s{2,}$/g, "")
    .trim();
}

function parseArticles(content) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const articles = [];
  let currentArticle = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line === "---") {
      continue;
    }

    if (/^#\s+/.test(line)) {
      continue;
    }

    if (/^##\s+/.test(line)) {
      const heading = sanitizeLine(line.replace(/^##\s+/, "").replace(/^[一二三四五六七八九十百千]+[、.．]\s*/, ""));
      currentArticle = {
        numberLabel: `第${toChineseNumber(articles.length + 1)}條`,
        heading,
        paragraphs: [],
        items: [],
      };
      articles.push(currentArticle);
      continue;
    }

    if (!currentArticle) {
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      currentArticle.items.push(sanitizeLine(line.replace(/^[-*]\s+/, "")));
      continue;
    }

    currentArticle.paragraphs.push(sanitizeLine(line));
  }

  return articles;
}

export default defineEventHandler(async () => {
  try {
    const content = await readFile(POLICY_PATH, "utf8");
    const articles = parseArticles(content);

    if (!articles.length) {
      throw new Error("policy parse failed");
    }

    return {
      title: parseTitle(content),
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
