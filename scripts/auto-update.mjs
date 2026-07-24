// 每日自动更新入口:拉最新日报 + 最近 7 天微博,写入 src/data
// 由 Windows 计划任务 ShigeHomeDailyUpdate 每天调用,也可手动跑:
//   node scripts/auto-update.mjs
//
// 说明:
// - fetch-weibo 是「覆盖写」,所以这里固定拉滚动 7 天,保证网站始终有近一周动态
// - 每次运行都把两个子脚本的输出追加到 scripts/auto-update.log,方便日后排查
// - 依赖计划任务把工作目录设为项目根(WorkingDirectory),脚本内用相对路径

import { spawnSync } from 'child_process';
import { appendFileSync } from 'fs';

const LOG = process.env.UPDATE_LOG_PATH || 'scripts/auto-update.log';

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  appendFileSync(LOG, line);
  process.stdout.write(line);
}

function run(args) {
  const r = spawnSync(process.execPath, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
  if (r.stdout) appendFileSync(LOG, r.stdout);
  if (r.stderr) appendFileSync(LOG, r.stderr);
  return r.status ?? -1;
}

// 今天(北京时区)
const now = new Date();
const bj = new Date(now.getTime() + 8 * 3600 * 1000);
const today = bj.toISOString().slice(0, 10);

log(`=== 自动更新开始 (today=${today}) ===`);
const daily = run(['scripts/fetch-daily.mjs']);
log(`fetch-daily 退出码 ${daily}`);
const weibo = run(['scripts/fetch-weibo.mjs', today, '7']);
log(`fetch-weibo 退出码 ${weibo}`);
log(`=== 自动更新结束 (daily=${daily}, weibo=${weibo}) ===\n`);

process.exit(daily === 0 && weibo === 0 ? 0 : 1);
