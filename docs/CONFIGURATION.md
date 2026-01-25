# 配置指南

本文档详细说明如何配置 Cloudflare Workers 的环境变量和密钥。

## 环境变量说明

本项目需要以下环境变量：

| 变量名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `HOST` | Secret (加密) | 图片公开访问的域名 | `https://pic.domain.com/` |
| `TOKEN` | Secret (加密) | API 认证使用的 Bearer Token | `your-secret-token` |
| `MY_BUCKET` | R2 Binding | R2 存储桶绑定 | 在 wrangler.toml 配置 |

## 配置方式

### 方式一：通过 Cloudflare Dashboard（推荐用于生产环境）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 选择你的账户

2. **进入 Worker 设置**
   - 点击 "Workers & Pages"
   - 选择你的 Worker 项目
   - 点击 "Settings" 标签
   - 选择 "Variables" 选项

3. **添加密钥 (HOST)**
   - 点击 "Add variable" 按钮
   - Variable name: `HOST`
   - Value: `https://pic.domain.com/` (请替换为你的实际域名)
   - 点击 "Encrypt" 按钮（这会将其转换为 Secret）
   - 点击 "Save"

4. **添加密钥 (TOKEN)**
   - 点击 "Add variable" 按钮
   - Variable name: `TOKEN`
   - Value: 输入你的密钥（例如：`your-secret-token-here`）
   - 点击 "Encrypt" 按钮（这会将其转换为 Secret）
   - 点击 "Save"

5. **部署更改**
   - 点击 "Save and deploy" 按钮
   - 环境变量会立即生效

### 方式二：通过 Wrangler CLI

使用 Wrangler CLI 配置所有密钥（推荐）：

**配置 HOST：**
```bash
wrangler secret put HOST
```

系统会提示你输入 secret 值：
```
Enter a secret value: https://pic.domain.com/
```

**配置 TOKEN：**
```bash
wrangler secret put TOKEN
```

系统会提示你输入 secret 值：
```
Enter a secret value: ********
```

**为特定环境配置（如果有多个环境）：**
```bash
# 为 production 环境设置
wrangler secret put HOST --env production
wrangler secret put TOKEN --env production

# 为 staging 环境设置
wrangler secret put HOST --env staging
wrangler secret put TOKEN --env staging
```

**查看已配置的 secrets：**
```bash
wrangler secret list
```

**删除 secret：**
```bash
wrangler secret delete HOST
wrangler secret delete TOKEN
```

### 方式三：本地开发配置

对于本地开发，使用 `.dev.vars` 文件：

1. **创建 .dev.vars 文件**
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. **编辑 .dev.vars 文件**
   ```
   TOKEN=your-local-dev-token
   HOST=https://pic.domain.com/
   ```

3. **注意事项**
   - `.dev.vars` 文件仅用于本地开发
   - 该文件已在 `.gitignore` 中，不会被提交到版本控制
   - 每个开发者需要自己创建这个文件
   - 不要在 `.dev.vars` 中使用生产环境的密钥

## R2 存储桶配置

R2 存储桶在 `wrangler.toml` 中配置：

```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "your-bucket-name"
```

**设置步骤：**

1. 在 Cloudflare Dashboard 中创建 R2 存储桶
2. 记下存储桶名称
3. 在 `wrangler.toml` 中将 `bucket_name` 改为你的存储桶名称

## 验证配置

### 验证本地开发环境

```bash
# 启动本地开发服务器
pnpm run dev

# 测试健康检查
curl http://localhost:8787/

# 测试上传（需要配置正确的 TOKEN）
curl -X POST \
  -H "Authorization: Bearer your-local-dev-token" \
  -F "file=@test-image.jpg" \
  http://localhost:8787/api/v1/upload
```

### 验证生产环境

```bash
# 测试健康检查
curl https://your-worker.workers.dev/

# 测试上传
curl -X POST \
  -H "Authorization: Bearer your-production-token" \
  -F "file=@test-image.jpg" \
  https://your-worker.workers.dev/api/v1/upload
```

## 常见问题

### 1. 如何生成安全的 TOKEN？

```bash
# 使用 openssl 生成随机 token
openssl rand -base64 32

# 使用 Node.js 生成
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. TOKEN 和 HOST 未设置时会发生什么？

如果环境变量未正确配置，API 会返回 500 错误：
- `Server configuration error: TOKEN not set`
- `Server configuration error: HOST not set`

### 3. 如何更新已部署的 SECRET？

```bash
# 更新 HOST
wrangler secret put HOST

# 更新 TOKEN
wrangler secret put TOKEN

# 系统会提示输入新的 secret 值
```

### 4. 为什么 HOST 也使用 Secret？

虽然 HOST 通常不是敏感信息，但使用 Secret 有以下好处：
- **统一管理**：所有配置都通过 Secret 管理，配置方式一致
- **灵活性**：可以在不修改代码或配置文件的情况下更改域名
- **环境隔离**：不同环境可以使用完全不同的配置，而无需修改代码

如果你更喜欢将 HOST 作为普通 Variable，可以在 `wrangler.toml` 中添加：
```toml
[vars]
HOST = "https://pic.domain.com/"
```

### 5. 本地开发时如何调试配置？

在代码中添加日志：

```typescript
console.log('HOST:', c.env.HOST)
console.log('TOKEN configured:', !!c.env.TOKEN)
```

## 安全建议

1. **永远不要将 Secrets 提交到版本控制**
   - 确保 `.dev.vars` 在 `.gitignore` 中
   - 不要在 `wrangler.toml` 中明文写入 HOST 或 TOKEN
   - 所有敏感配置应通过 `wrangler secret put` 或 Dashboard 设置

2. **定期轮换 TOKEN**
   - 定期更新生产环境的 TOKEN
   - 使用强随机生成的值

3. **使用不同的配置**
   - 开发环境和生产环境使用不同的 HOST 和 TOKEN
   - 不同项目使用不同的 TOKEN

4. **验证 HOST 配置**
   - 确保 HOST 指向你控制的域名
   - 使用 HTTPS
   - HOST 必须以 `/` 结尾（例如：`https://pic.domain.com/`）

5. **监控使用情况**
   - 在 Cloudflare Dashboard 中监控 Worker 的请求
   - 检查异常的 401 错误率（可能表示有人在尝试未授权访问）
   - 检查异常的 500 错误率（可能表示配置问题）

## 环境隔离

如果需要多个环境（开发、staging、生产），可以在 `wrangler.toml` 中配置：

```toml
# 默认环境（生产）
name = "hono-cloudflare-r2"

[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "production-bucket"

# Staging 环境
[env.staging]
name = "hono-cloudflare-r2-staging"
r2_buckets = [
  { binding = "MY_BUCKET", bucket_name = "staging-bucket" }
]

# Development 环境
[env.development]
name = "hono-cloudflare-r2-dev"
r2_buckets = [
  { binding = "MY_BUCKET", bucket_name = "dev-bucket" }
]
```

部署到不同环境：

```bash
# 部署到生产环境
wrangler deploy

# 部署到 staging 环境
wrangler deploy --env staging

# 部署到 development 环境
wrangler deploy --env development
```

为每个环境设置不同的 Secrets：

```bash
# 生产环境
wrangler secret put HOST
wrangler secret put TOKEN

# Staging 环境
wrangler secret put HOST --env staging
wrangler secret put TOKEN --env staging

# Development 环境
wrangler secret put HOST --env development
wrangler secret put TOKEN --env development
```

**本地开发环境配置（.dev.vars）：**
```
HOST=http://localhost:8787/
TOKEN=local-dev-token
```
