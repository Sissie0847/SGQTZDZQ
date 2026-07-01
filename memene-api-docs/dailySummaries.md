# 按订阅方案 ID 获取历史日报列表

> GET /v1/meme/dailySummaries


## 接口说明

按订阅方案 ID 翻页获取该方案（在 Memene 体系内也称为 "频道"）的历次日报概览。
返回的每条日报包含速览短句、Top 话题列表、对应日期与方案信息，可直接用于
列表展示或作为后续详情查询的索引。

**典型用法（AI 调用建议的"两步"流程）：**

1. 先通过 [按用户查询订阅方案列表](/docs/get-v1-meme-subscribePlans) 拿到目标
   `planId`（如果你已经有 planId，可以跳过此步）。
2. 调用本接口翻页读取该方案的历史日报。常见做法：

   - 想看 "最近 N 期日报"：用 `start=0&end=N&orderByDate=desc`。
   - 想按时间区间过滤："orderByDate=desc&startDate=<ms>&endDate=<ms>"，
     start/end 同时收窄为本批分页范围。

**查询参数：**

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `planId` | string | 必填 | 目标订阅方案 ID（即频道 ID） |
| `start` | string(number) | 必填 | 起点索引（0 表示从最新一条开始） |
| `end` | string(number) | 必填 | 终点索引（不包含），`end - start` 即一批最多返回多少条 |
| `orderByDate` | "asc" \| "desc" | 可选 | 排序方向；默认 `desc`（最新优先） |
| `startDate` | string(number) | 可选 | 起始时间戳，毫秒级字符串 |
| `endDate` | string(number) | 可选 | 截止时间戳，毫秒级字符串 |
| `onlyFavorites` | "true" \| "false" | 可选 | 是否仅返回收藏过的日报；通常对外调用方填 `false` 或不传 |

> **关于 start/end**：上游使用 "从最新一条为 0 开始的下标区间"。也就是说
> `start=0&end=20` 拿到最新 20 期；下一页用 `start=20&end=40`。
> 始终传字符串数字即可（如 `"0"` / `"20"`），路由会透传。

**返回值结构：**

```text
data
├── totalCount             # 当前过滤条件下的总日报数，用于客户端分页
└── historyRecords[]       # 本批日报记录
    ├── id                 # 数据库自增 ID
    ├── refSubscribePlanId # 关联订阅方案 ID（与查询 planId 一致）
    ├── planName           # 方案名（冗余便于直接展示）
    ├── date               # 日报对应日期，YYYY-MM-DD
    ├── timestamp          # 日报生成毫秒级时间戳
    ├── week               # 星期几（中文）
    ├── summaryTitle       # 日报短标题（系统生成）
    ├── title              # 日报详细标题
    ├── contentSummary[]   # 速览短句列表，可直接拼接展示
    ├── topTopicList[]     # 当日 Top N 话题，每项含 index/topic/isRelated
    ├── isFavorited        # 当前调用上下文下是否已收藏
    └── avatar             # 方案封面图，便于卡片渲染
```

**速读字段建议（写 AI Prompt 时优先消费）：**

- 想拿日报"一句话总结"：用 `summaryTitle` 或 `title`。
- 想拿日报"速览短句"：用 `contentSummary` 数组，每条短句已是可读句子。
- 想拿日报"重点话题"：用 `topTopicList` 的 `topic` 字段，按数组顺序即重要度。

**错误说明：**

| HTTP 状态码 | 含义 |
|-----------|------|
| 400 | planId / start / end 缺失或格式错误 |
| 401 | API Key 无效 |
| 402 | 余额不足 |
| 502 | 上游 Meme API 服务暂时不可用 |

**授权说明：**

- 需要提供有效的 API Key（Bearer Token）
- 每次调用按 `unitPrice` 扣除相应费用，失败时自动退还


**Base URL**: `https://api.memene.cn`
**完整地址**: `https://api.memene.cn/v1/meme/dailySummaries`

**需要认证**: 是（Bearer Token）

### 查询参数

| 参数名 | 类型 | 必填 | 说明 |
| ------ | ---- | ---- | ---- |
| planId | string | 是 | 订阅方案 ID。可通过订阅方案列表接口获取，作为本接口的主要筛选条件。 |
| start | string | 是 | 起点索引（字符串数字）。0 表示从最新一条日报开始；用于分页配合 end。 |
| end | string | 是 | 终点索引（字符串数字，不包含该位置）。`end - start` 等于本次最多返回的条数。 |
| orderByDate | string | 否 | 按日期排序方向。asc=升序，desc=降序。默认 desc。 |
| startDate | string | 否 | 起始时间戳（毫秒级字符串）。仅返回该时间之后的日报。 |
| endDate | string | 否 | 截止时间戳（毫秒级字符串）。仅返回该时间之前的日报。 |
| onlyFavorites | string | 否 | 是否仅返回已收藏的日报。true/false 字符串。默认 false。 |

### 响应

**200** (application/json): Default Response

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| statusCode | number | 是 | 状态码。200 表示成功。 |
| statusText | string | 是 | 状态文本。 |
| data | object | 是 | 历史日报数据主体。 |
|   └ totalCount | number | 是 | 满足条件的日报总条数。可用于实现客户端分页。 |
|   └ historyRecords | array | 是 | 本次返回的日报记录列表，按 orderByDate 排序。 |
|     └ id | number | 是 | 日报记录的数据库自增 ID。 |
|     └ refSubscribePlanId | string | 是 | 关联的订阅方案 ID。 |
|     └ planName | string | 是 | 订阅方案名称（冗余字段，便于直接展示）。 |
|     └ date | string | 是 | 日报对应的内容日期，格式 YYYY-MM-DD。 |
|     └ timestamp | number | 是 | 日报生成时间的毫秒级时间戳。 |
|     └ week | string | 否 | 对应中文星期，如 "星期一"。 |
|     └ summaryTitle | string | 是 | 日报标题（系统生成的简短描述）。 |
|     └ title | string | 否 | 日报详细标题（通常含日期后缀）。 |
|     └ contentSummary | array | 是 | 日报速览短句列表，可直接拼接展示作为内容摘要。 |
|     └ topTopicList | array | 是 | 当日 Top N 话题列表。索引大致代表话题在原文中的位置。 |
|       └ index | number | 是 | 话题在日报全文中的原始序号。 |
|       └ topic | string | 是 | 话题标题。 |
|       └ isRelated | boolean | 是 | 是否被判定为与订阅方案主题相关。 |
|     └ isFavorited | boolean | 是 | 当前请求上下文下，该日报是否已被收藏。 |
|     └ avatar | string | 否 | 订阅方案封面图，便于直接展示。 |

示例：

```json
{
  "statusCode": 200,
  "statusText": "OK",
  "data": {
    "totalCount": 1,
    "historyRecords": [
      {
        "id": 2188,
        "refSubscribePlanId": "cm6u2wnxw0000pbv90wk75eff",
        "planName": "人工智能前瞻报",
        "date": "2025-02-24",
        "timestamp": 1740348307992,
        "week": "星期一",
        "summaryTitle": "前瞻报_2025-02-24",
        "title": "DeepSeek 的崛起，揭示了美国的技术泡沫_2025-02-24",
        "contentSummary": [
          "DeepSeek 的崛起，揭示了美国的技术泡沫！",
          "AI 盛宴来袭，千亿资本引发人才争夺战！",
          "DeepSeek 引领 AI 革命，冲击 AGI 的未来！"
        ],
        "topTopicList": [
          {
            "index": 1,
            "topic": "DeepSeek 的崛起，揭示了美国的技术泡沫！",
            "isRelated": true
          },
          {
            "index": 2,
            "topic": "AI 盛宴来袭，千亿资本引发人才争夺战！",
            "isRelated": true
          }
        ],
        "isFavorited": false,
        "avatar": "https://yuansun-assests.oss-cn-hangzhou.aliyuncs.com/newsdiy/assets/subscribeChannel/templatePlanCover/cat_01.jpg"
      }
    ]
  }
}
```

**400** (application/json): Default Response

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| error | string | 是 | - |
| message | string | 是 | - |

示例：

```json
{
  "error": "Bad Request",
  "message": "缺少必要的 planId 或 userId"
}
```

**401** (application/json): Default Response

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| error | string | 是 | - |
| message | string | 是 | - |

示例：

```json
{
  "error": "Unauthorized",
  "message": "无效的 API Key"
}
```

**402** (application/json): Default Response

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| error | string | 是 | - |
| message | string | 是 | - |

示例：

```json
{
  "error": "Payment Required",
  "message": "余额不足"
}
```

**502** (application/json): Default Response

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| error | string | 是 | - |
| message | string | 是 | - |

示例：

```json
{
  "error": "Bad Gateway",
  "message": "上游 Meme API 服务暂时不可用"
}
```
