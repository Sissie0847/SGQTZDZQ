# 获取可订阅信息源列表

> GET /v1/meme/subscribeSources


## 接口说明

获取 Meme 平台上可订阅的信息源列表，支持按平台筛选和多种排序方式。

**主要用途：**
- 查看可订阅的信息源
- 筛选特定平台的信息源
- 按热度或更新时间排序

**查询参数：**
- `platform`：可选，指定平台筛选，如 `wechat`、`weibo` 等
- `sortBy`：可选，排序方式
  - `hot`：按热度排序（默认）
  - `updateTime`：按更新时间排序

**返回值：**
返回信息源列表，每个信息源包含：
- 基础信息：名称、描述、图标
- 订阅信息：订阅链接、更新频率
- 统计信息：订阅量、文章数量

**错误说明：**

| HTTP 状态码 | 含义 |
|-----------|------|
| 401 | API Key 无效 |
| 502 | 上游 Meme API 服务暂时不可用 |

**授权说明：**
- 需要提供有效的 API Key（Bearer Token）
- 每次调用会根据 `unitPrice` 扣除相应费用


**Base URL**: `https://api.memene.cn`
**完整地址**: `https://api.memene.cn/v1/meme/subscribeSources`

**需要认证**: 是（Bearer Token）

### 查询参数

| 参数名 | 类型 | 必填 | 说明 |
| ------ | ---- | ---- | ---- |
| platform | string | 否 | 平台筛选 |
| orderBy | string | 否 | 返回的信息源的排序方式 |

### 响应

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
