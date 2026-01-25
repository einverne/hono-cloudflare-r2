# 文档目录

本目录包含项目的详细文档。

## 文档列表

### [API.md](./API.md)
API 接口文档，包含所有可用端点的详细说明：
- 接口列表和使用方法
- 请求/响应格式
- 认证方式
- 错误处理
- 示例代码

### [CONFIGURATION.md](./CONFIGURATION.md)
配置指南，详细说明如何配置 Cloudflare Workers 环境变量：
- 环境变量说明
- 通过 Dashboard 配置（推荐用于生产）
- 通过 Wrangler CLI 配置
- 本地开发配置
- 安全建议
- 环境隔离

## 快速开始

1. **阅读配置指南**：首先查看 [CONFIGURATION.md](./CONFIGURATION.md) 了解如何配置环境变量

2. **设置环境**：
   ```bash
   # 本地开发
   cp ../.dev.vars.example ../.dev.vars
   # 编辑 .dev.vars 填入你的配置

   # 生产环境
   wrangler secret put TOKEN
   ```

3. **查看 API 文档**：参考 [API.md](./API.md) 了解如何使用 API

## 项目说明

这是一个基于 Cloudflare Workers 和 Hono 框架构建的图片上传服务，提供简单的 REST API 接口，将图片存储到 Cloudflare R2。

**主要特性：**
- 🚀 基于 Cloudflare Workers，全球边缘部署
- 🔐 Bearer Token 认证保护
- 📦 使用 R2 对象存储
- ⚡ 响应速度快，延迟低
- 🔧 配置简单，支持多环境

**技术栈：**
- [Hono](https://hono.dev/) - 轻量级 Web 框架
- [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算平台
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) - 对象存储
- TypeScript - 类型安全

## 获取帮助

- 遇到问题？查看 [CONFIGURATION.md](./CONFIGURATION.md) 的"常见问题"部分
- 需要了解 API？参考 [API.md](./API.md)
- 查看项目根目录的 [CLAUDE.md](../CLAUDE.md) 了解项目架构
