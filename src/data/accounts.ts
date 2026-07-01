// 自动生成 - 来源爬取系统 API /v2/weibo/user/{userId}
// 重新拉取: node scripts/fetch-accounts.mjs (头像不常变,一年跑一次足够)
// 生成时间: 2026-06-04T01:41:52.302Z

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

export const accounts: Account[] = [
  {
    "userId": "5977681646",
    "name": "种地吧卓沅",
    "kind": "official",
    "member": "卓沅",
    "screenName": "种地吧卓沅",
    "avatar": "https://wx1.sinaimg.cn/orj480/006wxK46ly8idk6o4968jj30lc0lcgn4.jpg",
    "verified": true,
    "description": "工作联系：lanlanstudio10@163.com",
    "followersCount": 412,
    "profileUrl": "https://m.weibo.cn/u/5977681646?luicode=10000011&lfid=1005055977681646&launchid=10000360-page_H5"
  },
  {
    "userId": "6110141995",
    "name": "种地吧何浩楠",
    "kind": "official",
    "member": "何浩楠",
    "screenName": "种地吧何浩楠",
    "avatar": "https://wx3.sinaimg.cn/orj480/006Fvx3lly8iachph0vxuj30u00u0mz6.jpg",
    "verified": true,
    "description": "工作联系：lanlanstudio10@163.com",
    "followersCount": 457,
    "profileUrl": "https://m.weibo.cn/u/6110141995?luicode=10000011&lfid=1005056110141995&launchid=10000360-page_H5"
  },
  {
    "userId": "5955330603",
    "name": "种地吧王一珩",
    "kind": "official",
    "member": "王一珩",
    "screenName": "种地吧王一珩",
    "avatar": "https://wx1.sinaimg.cn/orj480/006v1Xxply8i4savr6hexj30u00u041f.jpg",
    "verified": true,
    "description": "工作联系：lanlanstudio10@163.com",
    "followersCount": 467,
    "profileUrl": "https://m.weibo.cn/u/5955330603?luicode=10000011&lfid=1005055955330603&launchid=10000360-page_H5"
  },
  {
    "userId": "6045142049",
    "name": "种地吧鹭卓",
    "kind": "official",
    "member": "鹭卓",
    "screenName": "种地吧鹭卓",
    "avatar": "https://wx1.sinaimg.cn/orj480/006B6NB7ly8idnhetn9hrj30u00u0mzh.jpg",
    "verified": true,
    "description": "工作联系：lanlanstudio10@163.com",
    "followersCount": 415,
    "profileUrl": "https://m.weibo.cn/u/6045142049?luicode=10000011&lfid=1005056045142049&launchid=10000360-page_H5"
  },
  {
    "userId": "2821291057",
    "name": "种地吧蒋敦豪",
    "kind": "official",
    "member": "蒋敦豪",
    "screenName": "种地吧蒋敦豪",
    "avatar": "https://wx3.sinaimg.cn/orj480/a8297c31ly8idce1yalmnj20u00u0tbc.jpg",
    "verified": true,
    "description": "工作联系：lanlanstudio10@163.com",
    "followersCount": 451,
    "profileUrl": "https://m.weibo.cn/u/2821291057?luicode=10000011&lfid=1005052821291057&launchid=10000360-page_H5"
  },
  {
    "userId": "7747250546",
    "name": "种地吧陈少熙",
    "kind": "official",
    "member": "陈少熙",
    "screenName": "种地吧陈少熙",
    "avatar": "https://wx4.sinaimg.cn/orj480/008siFLYly8hbsa8anu8pj30e80e8dgc.jpg",
    "verified": true,
    "description": "工作联系：lanlanstudio10@163.com",
    "followersCount": 439,
    "profileUrl": "https://m.weibo.cn/u/7747250546?luicode=10000011&lfid=1005057747250546&launchid=10000360-page_H5"
  },
  {
    "userId": "3146361542",
    "name": "种地吧赵小童",
    "kind": "official",
    "member": "赵小童",
    "screenName": "种地吧赵小童",
    "avatar": "https://wx3.sinaimg.cn/orj480/bb89aac6ly8ghvwbodwrqj20e80e874s.jpg",
    "verified": true,
    "description": "工作联系：lanlanstudio10@163.com",
    "followersCount": 431,
    "profileUrl": "https://m.weibo.cn/u/3146361542?luicode=10000011&lfid=1005053146361542&launchid=10000360-page_H5"
  },
  {
    "userId": "7424483941",
    "name": "种地吧李耕耘",
    "kind": "official",
    "member": "李耕耘",
    "screenName": "种地吧李耕耘",
    "avatar": "https://wx3.sinaimg.cn/orj480/0086snqZly8hw37x2q2aej30u00u0q4x.jpg",
    "verified": true,
    "description": "工作联系: lanlanstudio10@163.com",
    "followersCount": 475,
    "profileUrl": "https://m.weibo.cn/u/7424483941?luicode=10000011&lfid=1005057424483941&launchid=10000360-page_H5"
  },
  {
    "userId": "1774840083",
    "name": "种地吧李昊",
    "kind": "official",
    "member": "李昊",
    "screenName": "种地吧李昊",
    "avatar": "https://wx3.sinaimg.cn/orj480/69c9e913ly8i78ai7cdugj20u00u040b.jpg",
    "verified": true,
    "description": "工作联系：lanlanstudio10@163.com",
    "followersCount": 456,
    "profileUrl": "https://m.weibo.cn/u/1774840083?luicode=10000011&lfid=1005051774840083&launchid=10000360-page_H5"
  },
  {
    "userId": "5599605202",
    "name": "李昊工作室",
    "kind": "studio",
    "member": "李昊",
    "screenName": "李昊工作室",
    "avatar": "https://wx3.sinaimg.cn/orj480/0066Xn6Wly8hvwm1ufeoxj30u00u00vk.jpg",
    "verified": true,
    "description": "",
    "followersCount": 17,
    "profileUrl": "https://m.weibo.cn/u/5599605202?luicode=10000011&lfid=1005055599605202&launchid=10000360-page_H5"
  },
  {
    "userId": "7878207193",
    "name": "蒋敦豪Official",
    "kind": "studio",
    "member": "蒋敦豪",
    "screenName": "蒋敦豪Official",
    "avatar": "https://wx2.sinaimg.cn/orj480/008Ba9zXly8idce7cxzpsj30u00u040p.jpg",
    "verified": true,
    "description": "",
    "followersCount": 21,
    "profileUrl": "https://m.weibo.cn/u/7878207193?luicode=10000011&lfid=1005057878207193&launchid=10000360-page_H5"
  },
  {
    "userId": "7910728743",
    "name": "何浩楠行车记录仪",
    "kind": "fanclub",
    "member": "何浩楠",
    "screenName": "何浩楠行车记录仪",
    "avatar": "https://wx3.sinaimg.cn/orj480/008DmBV5ly8iaci8bhfdgj30u00u0dii.jpg",
    "verified": false,
    "description": "何浩楠官方指定资讯站ℹ️  图频均可搬运，🈲商用 🍠🎵已同步上线  欢迎来到小何的世界～",
    "followersCount": 26,
    "profileUrl": "https://m.weibo.cn/u/7910728743?luicode=10000011&lfid=1005057910728743&launchid=10000360-page_H5"
  },
  {
    "userId": "7986422035",
    "name": "王一珩狂吃汉堡_真香版",
    "kind": "fanclub",
    "member": "王一珩",
    "screenName": "王一珩狂吃汉堡_创作版",
    "avatar": "https://wx2.sinaimg.cn/orj480/008IudcDly8i4ulmr9gw1j30u00u0adn.jpg",
    "verified": false,
    "description": "正式改名了，以后大帅哥和小美们都要吃好喝好👏（四处炫耀依旧发物料版【王一珩官方非正式物料屋】",
    "followersCount": 9,
    "profileUrl": "https://m.weibo.cn/u/7986422035?luicode=10000011&lfid=1005057986422035&launchid=10000360-page_H5"
  },
  {
    "userId": "8001910115",
    "name": "鹭卓1124号玫瑰园",
    "kind": "fanclub",
    "member": "鹭卓",
    "screenName": "鹭卓1124号玫瑰园",
    "avatar": "https://wx2.sinaimg.cn/orj480/008Jxcmnly8i296ebf1irj30u00u0jty.jpg",
    "verified": false,
    "description": "小园丁在线 不定期掉落玫瑰园的小彩蛋",
    "followersCount": 13,
    "profileUrl": "https://m.weibo.cn/u/8001910115?luicode=10000011&lfid=1005058001910115&launchid=10000360-page_H5"
  },
  {
    "userId": "8002034131",
    "name": "卓沅的沅气日常",
    "kind": "fanclub",
    "member": "卓沅",
    "screenName": "卓沅的沅气日常Plus版",
    "avatar": "https://wx4.sinaimg.cn/orj480/008JxICDly8idnogahagpj30lc0lcwfw.jpg",
    "verified": false,
    "description": "✨记录沅气满满的日常 🌟 存档每一个瞬间",
    "followersCount": 10,
    "profileUrl": "https://m.weibo.cn/u/8002034131?luicode=10000011&lfid=1005058002034131&launchid=10000360-page_H5"
  },
  {
    "userId": "7910550709",
    "name": "赵小童童话屋",
    "kind": "fanclub",
    "member": "赵小童",
    "screenName": "赵小童童话屋",
    "avatar": "https://wx4.sinaimg.cn/orj480/008DlRBzly8hnz1nsqcspj30u00u0mzs.jpg",
    "verified": false,
    "description": "赵小童官方指定资讯站🫡   图频均可搬运🈲商用 🍠/🎵同名  欢迎来到童七七的家✨",
    "followersCount": 19,
    "profileUrl": "https://m.weibo.cn/u/7910550709?luicode=10000011&lfid=1005057910550709&launchid=10000360-page_H5"
  },
  {
    "userId": "7970402417",
    "name": "赵一博的炸鱼饼铺",
    "kind": "fanclub",
    "member": "赵一博",
    "screenName": "赵一博的炸鱼饼铺",
    "avatar": "https://wx3.sinaimg.cn/orj480/008HoZLHly8hwx8brzlvoj30u00u0414.jpg",
    "verified": false,
    "description": "赵一博专属机位，合作联系：superup@qiyi.com",
    "followersCount": 7,
    "profileUrl": "https://m.weibo.cn/u/7970402417?luicode=10000011&lfid=1005057970402417&launchid=10000360-page_H5"
  }
];

export const accountsByUserId: Record<string, Account> = Object.fromEntries(
  accounts.map((a) => [a.userId, a])
);
