# 查询当前余额

> GET /v1/billing/balance


## 接口说明

查询当前开发者账户的余额信息，包括可用余额和冻结金额。

**主要用途：**
- 查询账户当前可用余额
- 查看因进行中的任务而被冻结的金额
- 监控账户资金状态，确保余额充足

**返回值：**
- `balance`：可用余额，单位为元，字符串格式以保持精度
- `frozenAmount`：冻结金额，单位为元，字符串格式以保持精度

**余额说明：**
- `balance`：实际可用余额，可以用于发起新的任务
- `frozenAmount`：已提交但尚未完成的任务所冻结的金额
  - 任务完成时，冻结金额会扣除并更新到交易记录
  - 任务失败时，冻结金额会解冻返还到可用余额

**授权说明：**
- 需要提供有效的 API Key（Bearer Token）
- 此接口不收费


**Base URL**: `https://api.memene.cn`
**完整地址**: `https://api.memene.cn/v1/billing/balance`

**需要认证**: 是（Bearer Token）

### 响应

**200** (application/json): Default Response

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| balance | string | 是 | 可用余额（精确字符串） |
| frozenAmount | string | 是 | 冻结金额（精确字符串） |

示例：

```json
{
  "balance": "98.50",
  "frozenAmount": "1.50"
}
```
