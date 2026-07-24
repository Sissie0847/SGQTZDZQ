// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://sissie.so',
  integrations: [tailwind()],
  devToolbar: { enabled: false },
  // hybrid: 页面默认仍静态生成,仅 /api/img 这类标了 prerender=false 的路由走 serverless
  // (微博图床 sinaimg.cn 有防盗链,需要服务端带 Referer 转发,浏览器 <img> 做不到)
  adapter: vercel(),
});
