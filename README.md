# Cloudflare AI API 代理

一个优雅、可扩展的 Cloudflare Worker 项目，用于代理多个 AI 服务的 API 请求。采用配置驱动的通用代理架构，易于扩展新的 AI 服务。

## 功能特性

- ✅ 代理 OpenAI API 请求
- ✅ 代理 Grok API 请求
- ✅ 代理 Gimini AI API 请求
- ✅ 健康检查端点
- ✅ 服务列表查询
- ✅ 配置驱动的通用代理架构
- ✅ 易于扩展支持其他 AI 接口
- ✅ 统一的错误处理

## 架构优势

### 配置驱动
所有 AI 服务配置集中在 `AI_SERVICES` 对象中，添加新服务只需修改配置：

```javascript
const AI_SERVICES = {
  openai: {
    baseUrl: 'https://api.openai.com',
    pathPrefix: '/openai'
  },
  grok: {
    baseUrl: 'https://api.x.ai',
    pathPrefix: '/grok'
  },
  gimini: {
    baseUrl: 'https://generativelanguage.googleapis.com',
    pathPrefix: '/gimini'
  }
};
```

### 代码复用
使用统一的 `proxyRequest` 函数处理所有代理请求，避免代码重复。

### 动态路由
通过 `Object.entries` 自动生成路由，无需手动编写每个服务的路由处理函数。

## 安装与部署

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

### 3. 部署到 Cloudflare

```bash
npm run deploy
```

## 使用方法

### 查看可用服务

```bash
curl https://channel.xxxxx.workers.dev/services
```

### 健康检查

```bash
curl https://channel.xxxxx.workers.dev/health
```

### OpenAI API 代理

将原始 OpenAI API 请求的 URL 从 `https://api.openai.com/v1/...` 改为 `https://channel.xxxxx.workers.dev/openai/v1/...`

例如：
- 原始：`https://api.openai.com/v1/chat/completions`
- 代理：`https://channel.xxxxx.workers.dev/openai/v1/chat/completions`

```bash
curl https://channel.xxxxx.workers.dev/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Grok API 代理

将原始 Grok API 请求的 URL 从 `https://api.x.ai/v1/...` 改为 `https://channel.xxxxx.workers.dev/grok/v1/...`

例如：
- 原始：`https://api.x.ai/v1/chat/completions`
- 代理：`https://channel.xxxxx.workers.dev/grok/v1/chat/completions`

```bash
curl https://channel.xxxxx.workers.dev/grok/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-3-mini",
    "messages": [
        {
            "role": "user",
            "content": "Hello, how are you?"
        }
    ]
}'
```

### Gimini AI API 代理

将原始 Gimini AI API 请求的 URL 从 `https://generativelanguage.googleapis.com/...` 改为 `https://channel.xxxxx.workers.dev/gimini/...`

例如：
- 原始：`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`
- 代理：`https://channel.xxxxx.workers.dev/gimini/v1beta/models/gemini-3-flash-preview:generateContent`

```bash
curl https://channel.xxxxx.workers.dev/gimini/v1beta/models/gemini-3-flash-preview:generateContent \
  -H "x-goog-api-key: YOUR_GIMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "system_instruction": {
    "parts": [{"text": "你是一个专业的编程助手"}]
  },
  "contents": [
    {
      "role": "user",
      "parts": [{"text": "你好"}]
    },
    {
      "role": "model",
      "parts": [{"text": "你好！有什么我可以帮助你的吗？"}]
    },
    {
      "role": "user",
      "parts": [{"text": "帮我写一个排序函数"}]
    }
  ]
}'
```

### 添加新的 AI 服务
```javascript
const AI_SERVICES = {
  openai: {
    baseUrl: 'https://api.openai.com',
    pathPrefix: '/openai'
  },
  grok: {
    baseUrl: 'https://api.x.ai',
    pathPrefix: '/grok'
  },
  gimini: {
    baseUrl: 'https://generativelanguage.googleapis.com',
    pathPrefix: '/gimini'
  },
  // 添加新的 AI 服务
  anthropic: {
    baseUrl: 'https://api.anthropic.com',
    pathPrefix: '/anthropic'
  },
  cohere: {
    baseUrl: 'https://api.cohere.ai',
    pathPrefix: '/cohere'
  }
};
```

添加配置后，重新部署即可：

```bash
npm run deploy
```

现在可以通过以下 URL 访问新服务：
- `https://channel.xxxxx.workers.dev/anthropic/*`
- `https://channel.xxxxx.workers.dev/cohere/*`

## API 端点

### 1. 健康检查
```
GET /health
```

返回示例：
```json
{
  "status": "ok",
  "services": ["openai", "grok", "gimini"],
  "timestamp": "2024-03-18T08:30:00.000Z"
}
```

### 2. 服务列表
```
GET /services
```

返回示例：
```json
{
  "services": [
    {
      "name": "openai",
      "baseUrl": "https://api.openai.com",
      "pathPrefix": "/openai",
      "example": "https://channel.xxxxx.workers.dev/openai/v1/chat/completions"
    },
    {
      "name": "grok",
      "baseUrl": "https://api.x.ai",
      "pathPrefix": "/grok",
      "example": "https://channel.xxxxx.workers.dev/grok/v1/chat/completions"
    },
    {
      "name": "gimini",
      "baseUrl": "https://generativelanguage.googleapis.com",
      "pathPrefix": "/gimini",
      "example": "https://channel.xxxxx.workers.dev/gimini/v1beta/models/gemini-3-flash-preview:generateContent"
    }
  ]
}
```

### 3. AI 服务代理
```
{pathPrefix}/*
```

例如：
- `/openai/*` - OpenAI API
- `/grok/*` - Grok API

## 请求头处理

代理只允许以下请求头通过：
- `Authorization`
- `Content-Type`
- `x-goog-api-key`（仅用于 Gimini AI API）

如需添加更多允许的请求头，修改 `ALLOWED_HEADERS` 数组：

```javascript
const ALLOWED_HEADERS = [
  'Authorization',
  'Content-Type',
  'x-goog-api-key',
  // 其他自定义请求头
  'X-Custom-Header'
];
```
## 注意事项

- 此代理服务不会修改请求或响应内容，只是简单地转发请求
- 您需要确保在请求中包含正确的 API 密钥
- 所有请求和响应都会通过 Cloudflare 网络传输，可能会有轻微的延迟
- 只允许 `Authorization` , `Content-Type` 和 `x-goog-api-key` 请求头通过代理

## 故障排除

### 常见问题

1. **认证失败**：检查 API 密钥是否正确
2. **网络错误**：确认 Worker 服务正常运行
3. **模型不存在**：检查模型名称是否正确
4. **超时**：增加请求超时时间

### 调试建议

- 使用健康检查端点确认服务状态：`https://channel.xxxxx.workers.dev/health`
- 查看可用服务：`https://channel.xxxxx.workers.dev/services`
- 检查 Worker 日志：`npx wrangler tail`
- 验证 API 密钥是否有效

## 许可证

MIT
