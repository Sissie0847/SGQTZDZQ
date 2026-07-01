# 按日期获取产品频道新闻数据

> GET /v1/meme/productNews/:date


## 接口说明

获取 Memene 产品频道（[memene.cn/model](https://memene.cn/model)）指定日期的新闻数据。返回的是经过处理和结构化的产品动态信息，每个产品包含整合文章和原始事件两层数据。

**主要用途：**
- 获取某一天的产品频道新闻概览
- 获取各产品经过编辑整合后的文章（用于展示）
- 获取各产品未经整合的原始事件数据

**路径参数：**
- `date`：查询日期，格式 `YYYY-MM-DD`（如 `2025-04-01`）

**返回数据结构：**

```
data
├── date                          # 内容日期
├── mainContent
│   ├── type                      # 类型标识，如 "productEventsSummary"
│   ├── totalProducts             # 当天涉及的产品总数
│   └── results[]                 # 各产品的事件结果
│       ├── productName           # 产品名称，如 "ChatGPT"
│       ├── generalTitle          # 该产品当天事件的总标题（一句话概括）
│       ├── generalSummary        # 该产品当天事件的总摘要（一段话综合）
│       ├── articles[]            # 整合文章（由 originalEvents 加工生成）
│       │   ├── title             # 文章标题
│       │   ├── content           # 文章正文（Markdown 格式）
│       │   ├── tags              # 逗号分隔的标签字符串
│       │   └── sourceLinks[]     # 信息来源链接
│       └── originalEvents[]      # 原始事件（未经整合的独立事件）
│           ├── eventName         # 事件名称
│           ├── eventSummary      # 事件详细摘要（Markdown 格式）
│           └── sourceLinks[]     # 信息来源链接
├── timelineContent               # 时间线内容（保留字段）
├── summaryId                     # 摘要 ID
└── createTime                    # 创建时间
```

**字段补充说明：**
- `articles` 是从 `originalEvents` 经过编辑整合后生成的，用于前端展示
- `content` 和 `eventSummary` 支持 Markdown 语法（`**加粗**`、`[链接](url)`、列表等）
- `tags` 为逗号分隔的字符串（如 `"AGI路线图,安全策略,平台生态"`），而非数组
- 带 `?` 标记的字段为可选，上游可能返回 `null`

**错误说明：**

| HTTP 状态码 | 含义 |
|-----------|------|
| 401 | API Key 无效 |
| 402 | 余额不足 |
| 502 | 上游 Meme API 服务暂时不可用 |

**授权说明：**
- 需要提供有效的 API Key（Bearer Token）
- 每次调用按 `unitPrice` 扣除相应费用


**Base URL**: `https://api.memene.cn`
**完整地址**: `https://api.memene.cn/v1/meme/productNews/:date`

**需要认证**: 是（Bearer Token）

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
| ------ | ---- | ---- | ---- |
| date | string | 是 | 查询日期，格式 YYYY-MM-DD |

### 响应

**200** (application/json): Default Response

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| statusCode | number | 是 | 状态码 |
| statusText | string | 是 | 状态文本 |
| message | string | 是 | 响应消息 |
| data | object | 是 | 产品频道新闻数据 |
|   └ id | number | 是 | 产品新闻记录 ID |
|   └ mainContent | object | 是 | 核心内容数据，包含各产品的事件结果 |
|     └ type | string | 是 | 数据类型标识，如 "productEventsSummary" |
|     └ results | array | 是 | 各产品的事件结果列表 |
|       └ articles | array | 是 | 经过编辑整合后的文章列表（用于前端展示），由 originalEvents 加工生成 |
|         └ tags | string | 是 | 标签，逗号分隔的字符串（如 "AGI路线图,安全策略"） |
|         └ title | string | 是 | 文章标题 |
|         └ content | string | 是 | 文章正文，支持 Markdown 格式（加粗、链接、列表等） |
|         └ sourceLinks | array | 是 | 信息来源链接列表 |
|       └ briefTitle | string | 是 | 产品新闻简要标题 |
|       └ productName | string | 是 | 产品名称，如 "ChatGPT"、"Gemini" |
|       └ generalTitle | string | 是 | 该产品当天事件的总标题（一句话概括所有事件） |
|       └ generalSummary | string | 是 | 该产品当天事件的总摘要（一段话综合描述） |
|       └ originalEvents | array | 是 | 原始事件列表（未经编辑整合的独立事件） |
|         └ eventName | string | 是 | 事件名称/标题 |
|         └ eventType | string | 是 | 事件类型 |
|         └ sourceLinks | array | 是 | 信息来源链接列表 |
|         └ eventSummary | string | 是 | 事件详细摘要，支持 Markdown 格式 |
|     └ totalProducts | number | 是 | 当天涉及的产品总数 |
|   └ timelineContent | object | 是 | 时间线内容（保留字段） |
|     └ [key: string] | string | 是 | - |
|   └ summaryId | string | 是 | 摘要 ID |
|   └ date | string | 是 | 内容日期，格式 YYYY-MM-DD |
|   └ createTime | string | 是 | 创建时间，ISO 8601 格式 |
|   └ type | string | 是 | 数据类型标识 |

示例：

```json
{
  "statusCode": 0,
  "statusText": "OK",
  "message": "success",
  "data": {
    "id": 1,
    "mainContent": {
      "type": "product",
      "results": [
        {
          "articles": [
            {
              "tags": "AI,LLM",
              "title": "GPT-5 发布：性能大幅提升",
              "content": "OpenAI 正式发布了 GPT-5 模型...",
              "sourceLinks": [
                "https://example.com/article1"
              ]
            }
          ],
          "briefTitle": "GPT-5 重大更新",
          "productName": "ChatGPT",
          "generalTitle": "ChatGPT 产品动态",
          "generalSummary": "OpenAI 发布 GPT-5，在多项基准测试中大幅领先。",
          "originalEvents": [
            {
              "eventName": "GPT-5 发布",
              "eventType": "product_release",
              "sourceLinks": [
                "https://example.com/source1"
              ],
              "eventSummary": "OpenAI 正式发布 GPT-5 模型。"
            }
          ]
        }
      ],
      "totalProducts": 1
    },
    "timelineContent": {},
    "summaryId": "summary_20250401",
    "date": "2025-04-01",
    "createTime": "2025-04-01T08:00:00Z",
    "type": null
  }
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
