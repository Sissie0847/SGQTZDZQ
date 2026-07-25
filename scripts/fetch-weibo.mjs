// 调用 Memene 爬取系统 API 拉指定日期所有哥哥+应援站的微博(含图片) → src/data/weibos.ts
// 运行: node scripts/fetch-weibo.mjs                  # 默认拉今天(北京时区)
//      node scripts/fetch-weibo.mjs 2026-06-03       # 拉指定日期
//      node scripts/fetch-weibo.mjs 2026-06-01 3     # 从 2026-06-01 起连续 3 天

import { readFileSync, writeFileSync } from 'fs';

function loadEnv() {
  try {
    const content = readFileSync('.env', 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    // 在 GitHub Actions 等环境中，凭据通过环境变量注入，不需要 .env 文件。
  }
}
loadEnv();

const API_KEY = process.env.MEMENE_API_KEY;
if (!API_KEY) { console.error('❌ .env 缺 MEMENE_API_KEY'); process.exit(1); }

// 十个勤天 + 应援站 + 工作室 userId(从 CSV 抽取的清单)
// 如需新增,继续往下加
const ACCOUNTS = [
  // 官方账号
  { userId: '5977681646', name: '种地吧卓沅', kind: 'official' },
  { userId: '6110141995', name: '种地吧何浩楠', kind: 'official' },
  { userId: '5955330603', name: '种地吧王一珩', kind: 'official' },
  { userId: '6045142049', name: '种地吧鹭卓', kind: 'official' },
  { userId: '2821291057', name: '种地吧蒋敦豪', kind: 'official' },
  { userId: '7747250546', name: '种地吧陈少熙', kind: 'official' },
  { userId: '3146361542', name: '种地吧赵小童', kind: 'official' },
  { userId: '7424483941', name: '种地吧李耕耘', kind: 'official' },
  { userId: '1774840083', name: '种地吧李昊', kind: 'official' },
  // 应援站/工作室
  { userId: '5599605202', name: '李昊工作室', kind: 'studio' },
  { userId: '7878207193', name: '蒋敦豪Official', kind: 'studio' },
  { userId: '7910728743', name: '何浩楠行车记录仪', kind: 'fanclub' },
  { userId: '7986422035', name: '王一珩狂吃汉堡_真香版', kind: 'fanclub' },
  { userId: '8001910115', name: '鹭卓1124号玫瑰园', kind: 'fanclub' },
  { userId: '8002034131', name: '卓沅的沅气日常', kind: 'fanclub' },
  { userId: '7910550709', name: '赵小童童话屋', kind: 'fanclub' },
  { userId: '7970402417', name: '赵一博的炸鱼饼铺', kind: 'fanclub' },
];

// 北京时区 YYYY-MM-DD 00:00 → unix 秒
function bjDateToUnix(dateStr, end = false) {
  // 北京时间 dateStr 当天 00:00:00(end=false)或 23:59:59(end=true)
  // 北京 UTC+8 → UTC 时间是 dateStr 当天 -8 小时
  const [y, m, d] = dateStr.split('-').map(Number);
  const hour = end ? 23 : 0;
  const min = end ? 59 : 0;
  const sec = end ? 59 : 0;
  // UTC.getTime(): 给定的是 UTC 各字段。我们要的是北京时间 (y,m,d,hour) 对应的 UTC 秒。
  // 北京时间 = UTC + 8h,所以 UTC = 北京时间 - 8h
  const utcMs = Date.UTC(y, m - 1, d, hour - 8, min, sec);
  return Math.floor(utcMs / 1000);
}

function todayInBeijing() {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 3600 * 1000);
  return bj.toISOString().slice(0, 10);
}

// HTML → 纯文本(微博的 text 字段是 HTML,带 emoji img alt、url-text span 等)
function htmlToText(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<img[^>]+alt="([^"]*)"[^>]*>/gi, '$1')  // emoji [来抱抱]
    .replace(/<[^>]+>/g, '')                          // 其他 HTML 标签
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function bjFromUtcIso(iso) {
  const d = new Date(iso);
  const bj = new Date(d.getTime() + 8 * 3600 * 1000);
  const y = bj.getUTCFullYear();
  const m = String(bj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(bj.getUTCDate()).padStart(2, '0');
  const hh = String(bj.getUTCHours()).padStart(2, '0');
  const mm = String(bj.getUTCMinutes()).padStart(2, '0');
  return { date: `${y}-${m}-${day}`, timeHm: `${hh}:${mm}` };
}

async function fetchWeibo(userIds, since, until) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const resp = await fetch('https://opensource.newsdiy.cn/api/v2/weibo/query', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: userIds, since, until, includeImages: true, limit: 200 }),
        signal: controller.signal,
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
      return resp.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        console.warn(`第 ${attempt} 次拉取失败，5 秒后重试：${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, 5_000));
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

const args = process.argv.slice(2);
const startDate = args[0] || todayInBeijing();
const days = parseInt(args[1] || '1', 10);

const dates = [];
for (let i = 0; i < days; i++) {
  const d = new Date(startDate + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - i);
  dates.push(d.toISOString().slice(0, 10));
}

console.log(`📡 拉取微博: ${dates[dates.length - 1]} ~ ${dates[0]} (${days} 天, ${ACCOUNTS.length} 账号)`);

const minSince = bjDateToUnix(dates[dates.length - 1], false);
const maxUntil = bjDateToUnix(dates[0], true);
console.log(`   时间窗(北京): ${dates[dates.length - 1]} 00:00 ~ ${dates[0]} 23:59`);
console.log(`   unix: ${minSince} ~ ${maxUntil}`);

const userIds = ACCOUNTS.map((a) => a.userId);
const accountMap = Object.fromEntries(ACCOUNTS.map((a) => [a.userId, a]));

const result = await fetchWeibo(userIds, minSince, maxUntil);
if (result.statusCode !== 200) {
  console.error('❌ API 错误:', JSON.stringify(result, null, 2));
  process.exit(1);
}
const items = result.data.items;
console.log(`✓ API 返回 ${items.length} 条 (total=${result.data.total})`);

// 转换 schema
const weibos = items.map((item) => {
  const { date, timeHm } = bjFromUtcIso(item.publishedAt);
  const account = accountMap[item.userId] || { name: '未知账号', kind: 'unknown' };
  return {
    id: item.uniqueId,
    publishedAt: item.publishedAt,
    date,
    timeHm,
    sourceName: account.name,
    sourceKind: account.kind,                                            // official | studio | fanclub
    userId: item.userId,
    text: htmlToText(item.text),
    repostsCount: item.repostsCount ?? 0,
    commentsCount: item.commentsCount ?? 0,
    attitudesCount: item.attitudesCount ?? 0,
    regionName: item.regionName || '',
    isRetweet: !!item.retweetId,
    retweetId: item.retweetId || undefined,
    pageInfoType: item.pageInfoType || undefined,
    pageInfoUrl: item.pageInfoUrl || undefined,
    images: (item.images || []).map((img) => ({
      url: img.url,                                                       // 360w 缩略
      largeUrl: img.largeUrl,                                             // 2000w 大图
      width: img.largeWidth,
      height: img.largeHeight,
    })),
  };
});

// 按日期分组,内部按时间倒序
const byDate = {};
for (const w of weibos) {
  if (!byDate[w.date]) byDate[w.date] = [];
  byDate[w.date].push(w);
}
for (const d in byDate) byDate[d].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

const dateStats = Object.entries(byDate).map(([d, ws]) => `${d}: ${ws.length}`).sort().reverse();
const imgStats = weibos.reduce((a, w) => a + w.images.length, 0);
console.log(`✓ 按日分布: ${dateStats.join(' | ')}`);
console.log(`✓ 共抓到 ${imgStats} 张图片(在 ${weibos.filter((w) => w.images.length > 0).length} / ${weibos.length} 条微博里)`);

const tsContent = `// 自动生成 - 来源 Memene 爬取系统 API /v2/weibo/query
// 重新拉取: node scripts/fetch-weibo.mjs [date] [days]
// 生成时间: ${new Date().toISOString()}

export type WeiboImage = {
  url: string;        // 缩略图(360w)
  largeUrl: string;   // 大图(2000w)
  width: number;
  height: number;
};

export type Weibo = {
  id: string;
  publishedAt: string;
  date: string;       // YYYY-MM-DD(北京时区)
  timeHm: string;     // HH:mm(北京时区)
  sourceName: string;
  sourceKind: 'official' | 'studio' | 'fanclub' | 'unknown';
  userId: string;
  text: string;       // 已 HTML→纯文本
  repostsCount: number;
  commentsCount: number;
  attitudesCount: number;
  regionName?: string;
  isRetweet: boolean;
  retweetId?: string;
  pageInfoType?: string;
  pageInfoUrl?: string;
  images: WeiboImage[];
};

export const weibos: Weibo[] = ${JSON.stringify(weibos, null, 2)};

export const weibosByDate: Record<string, Weibo[]> = ${JSON.stringify(byDate, null, 2)};
`;

writeFileSync('src/data/weibos.ts', tsContent, 'utf8');
console.log(`✓ 已写入 src/data/weibos.ts`);
