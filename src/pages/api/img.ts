// 微博图床(sinaimg.cn)有防盗链,不带 Referer 会 403。
// <img> 标签无法伪造 Referer,所以服务端代取图再转发。
// 只放行 sinaimg.cn,避免变成任意网址都能转发的开放代理。
export const prerender = false;

const ALLOWED_HOST = /(^|\.)sinaimg\.cn$/i;

export async function GET({ url }: { url: URL }) {
  const target = url.searchParams.get('u');
  if (!target) return new Response('missing u', { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response('bad url', { status: 400 });
  }
  if (parsed.protocol !== 'https:' || !ALLOWED_HOST.test(parsed.hostname)) {
    return new Response('host not allowed', { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), {
    headers: {
      Referer: 'https://weibo.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  if (!upstream.ok || !upstream.body) {
    return new Response('upstream error', { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'image/jpeg',
      // 图片内容不变,交给 Vercel 边缘缓存,减少重复回源
      'cache-control': 'public, max-age=86400, s-maxage=2592000, immutable',
    },
  });
}
