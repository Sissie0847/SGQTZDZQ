// 一次性拉 17 个账号的头像 + 信息 → src/data/accounts.ts
// 调爬取系统 GET /api/v2/weibo/user/{userId}
// 运行: node scripts/fetch-accounts.mjs
// 头像基本不变,一年跑一次足够。会保留 accounts.ts 里已有的 kind 等手填字段

import { readFileSync, writeFileSync, existsSync } from 'fs';

function loadEnv() {
  const content = readFileSync('.env', 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const API_KEY = process.env.MEMENE_API_KEY;
if (!API_KEY) { console.error('❌ .env 缺 MEMENE_API_KEY'); process.exit(1); }

// 账号清单 — 与 fetch-weibo.mjs 同步。kind 是手填(API 拿不到这个分类)
const ACCOUNTS = [
  { userId: '5977681646', name: '种地吧卓沅', kind: 'official', member: '卓沅' },
  { userId: '6110141995', name: '种地吧何浩楠', kind: 'official', member: '何浩楠' },
  { userId: '5955330603', name: '种地吧王一珩', kind: 'official', member: '王一珩' },
  { userId: '6045142049', name: '种地吧鹭卓', kind: 'official', member: '鹭卓' },
  { userId: '2821291057', name: '种地吧蒋敦豪', kind: 'official', member: '蒋敦豪' },
  { userId: '7747250546', name: '种地吧陈少熙', kind: 'official', member: '陈少熙' },
  { userId: '3146361542', name: '种地吧赵小童', kind: 'official', member: '赵小童' },
  { userId: '7424483941', name: '种地吧李耕耘', kind: 'official', member: '李耕耘' },
  { userId: '1774840083', name: '种地吧李昊', kind: 'official', member: '李昊' },
  // 工作室
  { userId: '5599605202', name: '李昊工作室', kind: 'studio', member: '李昊' },
  { userId: '7878207193', name: '蒋敦豪Official', kind: 'studio', member: '蒋敦豪' },
  // 应援站
  { userId: '7910728743', name: '何浩楠行车记录仪', kind: 'fanclub', member: '何浩楠' },
  { userId: '7986422035', name: '王一珩狂吃汉堡_真香版', kind: 'fanclub', member: '王一珩' },
  { userId: '8001910115', name: '鹭卓1124号玫瑰园', kind: 'fanclub', member: '鹭卓' },
  { userId: '8002034131', name: '卓沅的沅气日常', kind: 'fanclub', member: '卓沅' },
  { userId: '7910550709', name: '赵小童童话屋', kind: 'fanclub', member: '赵小童' },
  { userId: '7970402417', name: '赵一博的炸鱼饼铺', kind: 'fanclub', member: '赵一博' },
];

async function fetchUserOnce(userId, timeoutMs) {
  const url = `https://opensource.newsdiy.cn/api/v2/weibo/user/${userId}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  return resp.json();
}

async function fetchUser(userId) {
  // 3 次重试,timeout 递增 (15s/30s/45s),间隔 1s
  const attempts = [15000, 30000, 45000];
  let lastErr;
  for (let i = 0; i < attempts.length; i++) {
    try {
      return await fetchUserOnce(userId, attempts[i]);
    } catch (e) {
      lastErr = e;
      if (i < attempts.length - 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
  throw lastErr;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

console.log(`📡 拉取 ${ACCOUNTS.length} 个账号的头像...`);
const enriched = [];
let okCount = 0, failCount = 0;

for (const acc of ACCOUNTS) {
  try {
    const result = await fetchUser(acc.userId);
    const d = result.data || {};
    enriched.push({
      ...acc,
      screenName: d.screenName || acc.name,
      avatar: d.avatarHd || null,
      verified: d.verified ?? false,
      description: d.description || '',
      followersCount: d.followersCount ?? null,
      profileUrl: d.profileUrl || `https://m.weibo.cn/u/${acc.userId}`,
    });
    okCount++;
    console.log(`  ✓ ${acc.name} (${acc.userId}) → ${d.avatarHd ? '有头像' : '无头像'}`);
  } catch (e) {
    enriched.push({ ...acc, screenName: acc.name, avatar: null, verified: false, description: '', followersCount: null, profileUrl: `https://m.weibo.cn/u/${acc.userId}`, error: String(e.message || e) });
    failCount++;
    console.log(`  ✗ ${acc.name} (${acc.userId}) → ${e.message}${e.cause ? ' / cause: ' + e.cause : ''}`);
  }
  // 调用之间间隔 800ms 避免限速
  await sleep(800);
}

console.log(`✓ 成功 ${okCount}/${ACCOUNTS.length},失败 ${failCount}`);

const refreshedAt = new Date().toISOString();
const tsContent = `// 自动生成 - 来源爬取系统 API /v2/weibo/user/{userId}
// 重新拉取: node scripts/fetch-accounts.mjs (头像不常变,一年跑一次足够)
// 生成时间: ${refreshedAt}

export type AccountKind = 'official' | 'studio' | 'fanclub';

export type Account = {
  userId: string;
  name: string;                 // 手填名(用于 UI 显示,稳定)
  screenName: string;           // weibo screenName(API 来的,可能更准)
  kind: AccountKind;
  member: string;               // 关联哪个哥哥
  avatar: string | null;        // avatarHd, 没过期的版本
  verified: boolean;
  description: string;
  followersCount: number | null;
  profileUrl: string;
};

export const accounts: Account[] = ${JSON.stringify(enriched, null, 2)};

export const accountsByUserId: Record<string, Account> = Object.fromEntries(
  accounts.map((a) => [a.userId, a])
);
`;

writeFileSync('src/data/accounts.ts', tsContent, 'utf8');
console.log(`✓ 已写入 src/data/accounts.ts`);
