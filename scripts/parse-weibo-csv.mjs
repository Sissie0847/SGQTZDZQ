// 解析"十个勤天_微博最新60条_*.csv" → src/data/weibos.ts
// 运行: node scripts/parse-weibo-csv.mjs <csv-path>
// 默认读取根目录下最新一份 csv

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, basename } from 'path';

const argPath = process.argv[2];
const csvPath = argPath
  ? resolve(argPath)
  : (() => {
      const candidates = readdirSync('.').filter((f) => f.startsWith('十个勤天') && f.endsWith('.csv'));
      if (candidates.length === 0) {
        console.error('❌ 根目录没找到"十个勤天_*.csv",请用 `node scripts/parse-weibo-csv.mjs <path>` 指定');
        process.exit(1);
      }
      // 文件名里有日期,字典序最大就是最新
      candidates.sort().reverse();
      return resolve(candidates[0]);
    })();

console.log(`📄 解析 ${basename(csvPath)}`);

// 标准 CSV 解析器:支持双引号包裹/嵌套引号("")/字段内换行/逗号
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0].trim()));
}

const raw = readFileSync(csvPath, 'utf8');
const allRows = parseCSV(raw);
const [header, ...dataRows] = allRows;
console.log(`✓ 表头: ${header.join(' | ')}`);
console.log(`✓ 数据行: ${dataRows.length}`);

const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));

// UTC ISO → 北京时区 YYYY-MM-DD 和 HH:mm
function toBeijing(iso) {
  const d = new Date(iso);
  // 北京 UTC+8
  const bj = new Date(d.getTime() + 8 * 3600 * 1000);
  const y = bj.getUTCFullYear();
  const m = String(bj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(bj.getUTCDate()).padStart(2, '0');
  const hh = String(bj.getUTCHours()).padStart(2, '0');
  const mm = String(bj.getUTCMinutes()).padStart(2, '0');
  return { date: `${y}-${m}-${day}`, timeHm: `${hh}:${mm}` };
}

const weibos = dataRows.map((r) => {
  const publishedAt = r[idx.publishedAt];
  const { date, timeHm } = toBeijing(publishedAt);
  return {
    id: r[idx.uniqueId],
    publishedAt,
    date,
    timeHm,
    sourceName: r[idx.sourceName],
    userId: r[idx.userId],
    text: r[idx.text].trim(),
    repostsCount: Number(r[idx.repostsCount]) || 0,
    commentsCount: Number(r[idx.commentsCount]) || 0,
    attitudesCount: Number(r[idx.attitudesCount]) || 0,
    regionName: r[idx.regionName] || '',
    isRetweet: !!r[idx.retweetId],
    retweetId: r[idx.retweetId] || undefined,
  };
});

// 按 date 分组,每组内部按时间倒序(最新在上)
const byDate = {};
for (const w of weibos) {
  if (!byDate[w.date]) byDate[w.date] = [];
  byDate[w.date].push(w);
}
for (const date in byDate) {
  byDate[date].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

const dateStats = Object.entries(byDate)
  .map(([d, ws]) => `${d}: ${ws.length}`)
  .sort()
  .reverse();
console.log(`✓ 按日期分布: ${dateStats.join(' | ')}`);

// 哥哥/账号统计
const sourceCount = {};
for (const w of weibos) sourceCount[w.sourceName] = (sourceCount[w.sourceName] || 0) + 1;
const topSources = Object.entries(sourceCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log(`✓ Top 账号: ${topSources.map(([s, n]) => `${s}(${n})`).join(', ')}`);

const tsContent = `// 自动生成 - 来源 CSV 解析 (${basename(csvPath)})
// 重新解析: node scripts/parse-weibo-csv.mjs
// 生成时间: ${new Date().toISOString()}

export type Weibo = {
  id: string;
  publishedAt: string;
  date: string;
  timeHm: string;
  sourceName: string;
  userId: string;
  text: string;
  repostsCount: number;
  commentsCount: number;
  attitudesCount: number;
  regionName?: string;
  isRetweet: boolean;
  retweetId?: string;
};

export const weibos: Weibo[] = ${JSON.stringify(weibos, null, 2)};

export const weibosByDate: Record<string, Weibo[]> = ${JSON.stringify(byDate, null, 2)};
`;

writeFileSync('src/data/weibos.ts', tsContent, 'utf8');
console.log(`✓ 已写入 src/data/weibos.ts (${weibos.length} 条,覆盖 ${Object.keys(byDate).length} 天)`);
