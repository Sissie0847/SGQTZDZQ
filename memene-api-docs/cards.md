# 提交卡片生成任务

> POST /cards/


## 接口说明

> **⚠️ 注意：本接口目前仍在迭代开发中，暂时无法正常使用。请勿在生产环境中调用。**

提交卡片生成任务到队列。任务在后台异步执行，生成完成后可通过任务 ID 查询结果。

**主要用途：**
- 根据模板 ID 和填充数据生成卡片图片
- 支持异步模式和同步等待模式

**请求参数：**
- `templateId`：卡片模板 ID，指定使用哪个模板
- `data`：模板填充数据，键值对格式，用于替换模板中的变量

**查询参数：**
- `wait`：可选，设为 `true` 时最多等待 5 秒返回结果，超时则返回 pending 状态

**返回值：**
- `taskId`：任务唯一标识符，用于后续查询任务状态
- `status`：任务状态，`pending` 表示处理中，`completed` 表示已完成
- `outputUrl`：卡片图片的 CDN 地址，仅当 status 为 `completed` 时有值

**调用流程：**
1. 提交任务，立即返回 taskId 和 pending 状态
2. 后台 Worker 处理任务（渲染卡片、上传到 CDN）
3. 轮询 `GET /cards/:taskId` 查询任务状态
4. 当 status 变为 completed 时，outputUrl 包含生成的卡片图片地址

**授权说明：**
- 需要提供有效的 API Key（Bearer Token）
- 每次调用会根据 `unitPrice` 扣除相应费用
- 费用在任务提交时冻结，任务完成后确认扣除


**Base URL**: `https://api.memene.cn`
**完整地址**: `https://api.memene.cn/cards/`

**需要认证**: 是（Bearer Token）

### 查询参数

| 参数名 | 类型 | 必填 | 说明 |
| ------ | ---- | ---- | ---- |
| wait | string | 否 | 是否同步等待完成（最多 5 秒） |

### 请求体

| 参数名 | 类型 | 必填 | 说明 |
| ------ | ---- | ---- | ---- |
| templateId | string | 是 | 模板 ID |
| data | object | 是 | 模板填充数据 |
|   └ [key: string] | string | 是 | - |

### 请求体示例

```json
{
  "templateId": "card_template_001",
  "data": {
    "title": "示例标题",
    "content": "示例内容"
  }
}
```

### 响应

**202** (application/json): Default Response

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| taskId | string | 是 | - |
| status | string | 是 | - |
| outputUrl | string | 是 | - |

示例：

```json
{
  "taskId": "task_abc123",
  "status": "pending",
  "outputUrl": null
}
```
