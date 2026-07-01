// 拉取 Memene "十个勤天" 频道历史日报,生成 src/data/dailies.ts
// 运行: npm run fetch:daily
//
// 依赖: 仅 Node 18+ 自带 fetch,不引入外部包

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function loadEnv() {
  try {
    const content = readFileSync('.env', 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    console.error('❌ 未找到 .env 文件,请按 .env.example 创建一份');
    process.exit(1);
  }
}
loadEnv();

const API_KEY = process.env.MEMENE_API_KEY;
const PLAN_ID = process.env.MEMENE_PLAN_ID;
const PLAN_NAME = process.env.MEMENE_PLAN_NAME || '十个勤天';
const FETCH_LIMIT = parseInt(process.env.FETCH_LIMIT || '60', 10);
const BASE = 'https://api.memene.cn';

if (!API_KEY || !PLAN_ID) {
  console.error('❌ .env 缺少 MEMENE_API_KEY 或 MEMENE_PLAN_ID');
  process.exit(1);
}

// 田园色卡循环 — 5 套配色,呼应"种地"主题
const PALETTE = [
  { bg: '#E5A92D', word: '#1a1a1a' },                                        // 麦穗金
  { bg: 'linear-gradient(180deg, #6B8E23 0%, #4a6e1a 100%)', word: '#FAF5E6' }, // 麦田绿
  { bg: '#C25B3F', word: '#FAF5E6' },                                        // 落日砖红
  { bg: 'linear-gradient(135deg, #8B6F47 0%, #C9A875 100%)', word: '#FAF5E6' }, // 大地棕
  { bg: '#FAF5E6', word: '#3D2817' },                                        // 米黄底深棕字
];

// 从首话题切 2 字做封面大字(去掉书名号/标点/emoji/数字/英文)
function pickCoverWord(topic) {
  if (!topic) return '勤';
  const cleaned = topic.replace(/[\u{1F000}-\u{1FFFF}☀-➿a-zA-Z0-9\s《》「」『』(()).。,，、!!??:：;；·\-_…—"'""''【】\[\]]/gu, '');
  return cleaned.slice(0, 2) || '勤';
}

// contentSummary 实际是带 \n 的字符串(文档错标 array)。第一段通常是"今日要闻"
// 标识,第二段才是有梗的句子。取第二段,fallback 第一段。
function pickSnippet(contentSummary) {
  if (!contentSummary) return '';
  const parts = contentSummary.split('\n').map((s) => s.trim()).filter(Boolean);
  return parts.length > 1 ? parts[1] : parts[0] || '';
}

async function fetchPage(start, end) {
  const url = `${BASE}/v1/meme/dailySummaries?planId=${PLAN_ID}&start=${start}&end=${end}&orderByDate=desc`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  }
  return resp.json();
}

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

async function main() {
  console.log(`📡 拉取 "${PLAN_NAME}" 频道日报 (最近 ${FETCH_LIMIT} 条)...`);
  const result = await fetchPage(0, FETCH_LIMIT);

  if (result.statusCode !== 200) {
    console.error('❌ API 返回错误:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  const records = result.data.historyRecords;
  console.log(`✓ 拉到 ${records.length}/${result.data.totalCount} 条`);

  const dailies = records.map((r, idx) => {
    const palette = PALETTE[idx % PALETTE.length];
    const firstTopic = r.topTopicList?.[0]?.topic || r.title || '';
    return {
      id: String(r.id),
      date: r.date,
      week: r.week,
      title: firstTopic,
      snippet: pickSnippet(r.contentSummary),
      topTopics: (r.topTopicList || []).map((t) => t.topic),
      sourceLabel: r.planName || PLAN_NAME,
      channelAvatar: r.avatar,
      views: r.views,
      topicCount: r.totalCount,
      coverWord: pickCoverWord(firstTopic),
      coverBg: palette.bg,
      coverWordColor: palette.word,
    };
  });

  const tsContent = `// 自动生成 - 来源 Memene API /v1/meme/dailySummaries
// 重新拉取: npm run fetch:daily
// 生成时间: ${new Date().toISOString()}

export type Daily = {
  id: string;
  date: string;
  week?: string;
  title: string;
  snippet: string;
  topTopics: string[];
  sourceLabel: string;
  channelAvatar?: string;
  views?: number;
  topicCount?: number;
  coverWord?: string;
  coverBg?: string;
  coverWordColor?: string;
};

export const dailies: Daily[] = ${JSON.stringify(dailies, null, 2)};

/** 把 ISO 日期格式化成 "2026 年 6 月 2 日" */
export function formatDateZh(iso: string): string {
  const [y, m, d] = iso.split('-');
  return \`\${y} 年 \${parseInt(m)} 月 \${parseInt(d)} 日\`;
}
`;

  const tsPath = 'src/data/dailies.ts';
  ensureDir(tsPath);
  writeFileSync(tsPath, tsContent, 'utf8');
  console.log(`✓ 已写入 ${tsPath} (${dailies.length} 条)`);

  const rawPath = 'src/data/dailies-raw.json';
  writeFileSync(rawPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`✓ 原始 JSON 备份到 ${rawPath} (debug 用,已 gitignore)`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
