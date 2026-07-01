# Memene API 开放平台接口索引列表

> 下面是完整的 Memene API 开放平台的接口索引列表。当你不清楚某些接口的具体用法时，可以访问对应的接口文档查询。

> 完整导航地图: [llms-full.txt](https://platform.memene.cn/llms-full.txt)

Memene 提供 Meme 内容生成与管理相关的 RESTful API。
以下是所有公开可用的 API 端点。

## system

- [API 中台健康状态检查](https://platform.memene.cn/docs/get-health/llm.txt): `GET /health` [需要认证]
  检查 Memene API 开放平台的服务状态，可选验证 API Key 有效性。

## cards

- [查询任务状态](https://platform.memene.cn/docs/get-cards-taskId/llm.txt): `GET /cards/:taskId` [需要认证]
  根据任务 ID 查询卡片生成任务的执行状态和结果。
- [提交卡片生成任务](https://platform.memene.cn/docs/post-cards/llm.txt): `POST /cards/` [需要认证]
  根据模板和数据异步生成卡片图片，返回任务 ID 供后续查询。

## billing

- [查询当前余额](https://platform.memene.cn/docs/get-v1-billing-balance/llm.txt): `GET /v1/billing/balance` [需要认证]
  查询开发者账户的可用余额和冻结金额。
- [查询交易流水](https://platform.memene.cn/docs/get-v1-billing-transactions/llm.txt): `GET /v1/billing/transactions` [需要认证]
  分页查询开发者的计费交易记录，包括充值、扣费和解冻等资金变动。

## meme

- [按订阅方案 ID 获取历史日报列表](https://platform.memene.cn/docs/get-v1-meme-dailySummaries/llm.txt): `GET /v1/meme/dailySummaries` [需要认证]
  传入 planId 翻页读取该订阅方案（频道）的历史日报概览，每条日报含速览摘要、Top 话题列表与封面信息。
- [根据领域，获取某领域一个时间段内的资讯](https://platform.memene.cn/docs/post-v1-meme-memeItemsByDomain/llm.txt): `POST /v1/meme/memeItemsByDomain` [需要认证]
  指定新闻领域和日期范围，异步获取该时间段内的所有资讯条目。
- [查询获取某领域资讯的结果](https://platform.memene.cn/docs/get-v1-meme-memeItemsByDomain-taskId/llm.txt): `GET /v1/meme/memeItemsByDomain/:taskId`
  根据任务 ID 查询资讯获取任务的执行状态和结果。
- [按日期获取产品频道新闻数据](https://platform.memene.cn/docs/get-v1-meme-productNews-date/llm.txt): `GET /v1/meme/productNews/:date` [需要认证]
  获取指定日期的产品频道处理好的新闻数据，包含产品动态、事件摘要等结构化信息。
- [获取可订阅信息源列表](https://platform.memene.cn/docs/get-v1-meme-subscribeSources/llm.txt): `GET /v1/meme/subscribeSources` [需要认证]
  获取 Meme 平台可订阅的信息源，支持按平台筛选和排序。
- [获取 AI 产品信息源列表](https://platform.memene.cn/docs/get-v1-meme-aiProduct-aiProduct-sources/llm.txt): `GET /v1/meme/aiProduct/aiProduct/sources` [需要认证]
  获取所有可查询的 AI 产品信息源，包含名称、类型和原始地址。
- [批量查询 AI 产品信息](https://platform.memene.cn/docs/post-v1-meme-aiProduct-aiProduct-query/llm.txt): `POST /v1/meme/aiProduct/aiProduct/query` [需要认证]
  按信息源批量查询 AI 产品信息，返回按平台和 sourceId 分组的数据。
- [批量查询更新日志类信息源近日更新内容](https://platform.memene.cn/docs/post-v1-meme-changelog-query/llm.txt): `POST /v1/meme/changelog/query` [需要认证]
  按数据源、时间范围批量查询更新日志类信息源的近日更新内容，返回结构化的 Markdown 内容。
- [获取更新日志类信息源列表](https://platform.memene.cn/docs/get-v1-meme-changelog-sources/llm.txt): `GET /v1/meme/changelog/sources` [需要认证]
  获取所有可查询的更新日志类信息源，包含名称和原始地址。
- [查询微信文章的图片列表](https://platform.memene.cn/docs/get-v1-meme-wechat-images/llm.txt): `GET /v1/meme/wechat/images` [需要认证]
  根据微信文章 uniqueId 查询正文图片，返回原图地址、代理地址及尺寸信息。

## memene-business

- [Schaeffler 企业定制订阅方案](https://platform.memene.cn/docs/get-v1-memene-business-schaeffler/llm.txt): `GET /v1/memene/business/schaeffler` [需要认证]
  获取 Schaeffler 定制订阅方案的聚合内容数据，支持自定义时间范围。

## products

- [获取 API 资源项目录](https://platform.memene.cn/docs/get-v1-products/llm.txt): `GET /v1/products/`
  获取所有已启用的 API 资源项及其定价信息。

## v1

- [获取 API Key 使用统计](https://platform.memene.cn/docs/get-v1-users-apikey-usage/llm.txt): `GET /v1/users/apikey/usage` [需要认证]
  验证 API Key 有效性并返回近 30 天的调用量统计。
