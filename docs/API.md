# API 接口文档

## 概述

这是一个基于 Cloudflare Workers 和 Hono 框架构建的图片上传服务，提供 RESTful API 接口，支持图片上传到 Cloudflare R2 存储。

**Base URL**: 根据部署环境而定
**认证方式**: Bearer Token

---

## 认证

所有 `/api/*` 路径下的接口都需要进行 Bearer Token 认证。

**认证方式**:
```
Authorization: Bearer {TOKEN}
```

**示例**:
```bash
curl -H "Authorization: Bearer my-secret-token" https://your-domain.com/api/v1/upload
```

---

## 接口列表

### 1. 健康检查

检查服务是否正常运行。

**请求**

- **方法**: `GET`
- **路径**: `/`
- **认证**: 不需要

**响应**

- **状态码**: `200 OK`
- **Content-Type**: `application/json`

**响应体**:
```json
{
  "ok": true
}
```

**示例**:
```bash
curl https://your-domain.com/
```

---

### 2. 上传图片

上传图片文件到 R2 存储，返回图片的公开访问 URL。

**请求**

- **方法**: `POST`
- **路径**: `/api/v1/upload`
- **认证**: 需要 Bearer Token
- **Content-Type**: `multipart/form-data`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 要上传的图片文件 |

**响应**

**成功响应**:
- **状态码**: `200 OK`
- **Content-Type**: `application/json`

**响应体**:
```json
{
  "image": {
    "url": "https://pic.domain.com/images/{nanoid}.{ext}"
  }
}
```

**字段说明**:
- `image.url`: 图片的公开访问 URL，格式为 `{HOST}/images/{10位随机ID}.{原始文件扩展名}`

**错误响应**:

1. 无效文件
   - **状态码**: `400 Bad Request`
   - **Content-Type**: `text/plain`
   - **响应体**: `Invalid file`

2. 未授权
   - **状态码**: `401 Unauthorized`
   - 当请求头中缺少或提供了错误的 Bearer Token 时返回

3. 服务器配置错误
   - **状态码**: `500 Internal Server Error`
   - **Content-Type**: `text/plain`
   - **响应体**: `Server configuration error: TOKEN not set` 或 `Server configuration error: HOST not set`
   - 当服务器环境变量未正确配置时返回

**示例**:

```bash
# 使用 curl 上传图片
curl -X POST \
  -H "Authorization: Bearer my-secret-token" \
  -F "file=@/path/to/image.jpg" \
  https://your-domain.com/api/v1/upload
```

**成功响应示例**:
```json
{
  "image": {
    "url": "https://pic.domain.com/images/a1b2c3d4e5.jpg"
  }
}
```

---

## 错误处理

### 404 Not Found

当访问不存在的路径时，会返回 404 错误。

**响应**:
- **状态码**: `404 Not Found`
- **Content-Type**: `text/plain`
- **响应体**: `Not Found`

---

## 技术说明

### 文件存储

- **存储位置**: Cloudflare R2
- **文件路径格式**: `images/{nanoid}.{ext}`
  - `nanoid`: 10位随机字符串
  - `ext`: 原始文件的扩展名

### 支持的文件类型

理论上支持所有文件类型，但建议上传图片文件（如 `.jpg`, `.png`, `.gif`, `.webp` 等）。

### 文件大小限制

受 Cloudflare Workers 请求体大小限制约束（通常为 100MB）。

---

## 配置说明

服务需要通过 Cloudflare Workers 的 Secrets 进行配置。

### 通过 Cloudflare Dashboard 配置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages > 选择你的 Worker
3. 点击 Settings > Variables

**配置项**:

- **HOST** (Secret):
  - 类型: Secret（加密变量）
  - 说明: 图片公开访问的域名
  - 示例: `https://pic.domain.com/`
  - 配置位置: Variables 标签页 > 点击 "Add variable" > 输入后点击 "Encrypt" 按钮

- **TOKEN** (Secret):
  - 类型: Secret（加密变量）
  - 说明: API 认证使用的 Bearer Token
  - 示例: `your-secret-token-here`
  - 配置位置: Variables 标签页 > 点击 "Add variable" > 输入后点击 "Encrypt" 按钮

### 通过 Wrangler CLI 配置

```bash
# 设置 HOST
wrangler secret put HOST
# 提示时输入: https://pic.domain.com/

# 设置 TOKEN
wrangler secret put TOKEN
# 提示时输入你的 secret token

# 为特定环境配置
wrangler secret put HOST --env production
wrangler secret put TOKEN --env production
```

### 本地开发配置

创建 `.dev.vars` 文件（不要提交到版本控制）:
```
HOST=https://pic.domain.com/
TOKEN=your-local-dev-token
```

**详细配置说明请参考 [CONFIGURATION.md](./CONFIGURATION.md)**

---

## 部署环境

- **运行环境**: Cloudflare Workers
- **框架**: Hono
- **存储**: Cloudflare R2

---

## 更新日志

### v1.1.0
- 支持通过 Cloudflare Variables 和 Secrets 配置
- 移除硬编码的配置文件
- 增强配置安全性

### v1.0.0
- 初始版本
- 支持图片上传功能
- Bearer Token 认证
- R2 存储集成
