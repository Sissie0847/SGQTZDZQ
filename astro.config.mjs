// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

const isVercelBuild = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://shaonianzhijia.cn',
  integrations: [tailwind()],
  devToolbar: { enabled: false },
  // hybrid: 页面默认仍静态生成,仅 /api/img 这类标了 prerender=false 的路由走 serverless
  // (微博图床 sinaimg.cn 有防盗链,需要服务端带 Referer 转发,浏览器 <img> 做不到)
  // Keep Vercel available while the existing site remains online, but build a
  // standalone Node server for the new Alibaba Cloud deployment.
  adapter: isVercelBuild ? vercel() : node({ mode: 'standalone' }),
});
