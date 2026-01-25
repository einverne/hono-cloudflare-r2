# hono-cloudflare-r2

Upload images to Cloudflare R2 using Hono and Cloudflare Workers.

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure R2 Bucket

Update `wrangler.toml` with your R2 bucket information:

```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "your-bucket-name"
```

### 3. Set Secrets

**For local development**, create a `.dev.vars` file:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` and set your configuration:

```
HOST=https://pic.domain.com/
TOKEN=your-local-dev-token
```

**For production**, set secrets via Wrangler CLI:

```bash
wrangler secret put HOST
# Enter: https://pic.domain.com/

wrangler secret put TOKEN
# Enter: your-secret-token
```

### 4. Run Locally

```bash
pnpm run dev
```

### 5. Deploy to Cloudflare Workers

```bash
pnpm run deploy
```

If this is your first time deploying, you will be asked to log in to your Cloudflare account.

## Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Configuration Guide](docs/CONFIGURATION.md) - Detailed setup instructions
- [Project Overview](CLAUDE.md) - Architecture and development guide

## Features

- 🚀 Fast edge deployment with Cloudflare Workers
- 🔐 Bearer token authentication
- 📦 R2 object storage integration
- ⚡ Low latency worldwide
- 🔧 Simple configuration via Secrets

## Tech Stack

- [Hono](https://hono.dev/) - Lightweight web framework
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing platform
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) - Object storage
- TypeScript - Type safety
