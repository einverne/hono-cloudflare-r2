# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Cloudflare Workers application built with Hono that provides an image upload API backed by Cloudflare R2 storage. Images are uploaded via a REST endpoint, stored in R2 with unique identifiers, and publicly accessible URLs are returned.

## Development Commands

**Start local development server:**
```bash
pnpm run dev
```
This runs `wrangler dev src/index.ts` which starts a local Cloudflare Workers environment with hot reload.

**Deploy to Cloudflare:**
```bash
pnpm run deploy
```
This runs `wrangler deploy --minify src/index.ts` to deploy the worker to production.

## Architecture

**Framework & Runtime:**
- Built with [Hono](https://hono.dev/) web framework
- Runs on Cloudflare Workers (edge runtime)
- TypeScript with `@cloudflare/workers-types`

**File Structure:**
- `src/index.ts`: Main application entry point with route definitions
- `src/config.ts`: (deprecated) Legacy configuration file, no longer used
- `wrangler.toml`: Cloudflare Workers configuration including R2 bucket binding and variables

**Key Components:**

1. **Environment Bindings** (defined in `src/index.ts:6-10`):
   - `MY_BUCKET`: R2Bucket binding for file storage
   - `TOKEN`: Secret token for Bearer authentication (configured via Cloudflare Secrets)
   - `HOST`: Public domain URL for serving images (configured via Cloudflare Variables)

2. **Authentication**:
   - Bearer token auth middleware applied to all `/api/*` routes
   - Token configured via Cloudflare Workers Secrets (not hardcoded in source code)

3. **Upload Flow** (`POST /api/v1/upload`):
   - Accepts multipart form data with a `file` field
   - Generates unique 10-character ID using nanoid
   - Stores file as `images/{nanoid}.{ext}` in R2
   - Returns JSON with public URL

## Configuration

**Required Setup:**

1. **Update `wrangler.toml`**:
   - Set correct `bucket_name` for your R2 bucket

2. **Set Cloudflare Secrets** (for production):
   ```bash
   wrangler secret put HOST
   wrangler secret put TOKEN
   ```
   When prompted, enter:
   - HOST: Your public domain (e.g., `https://pic.domain.com/`)
   - TOKEN: Your secret bearer token for API authentication

3. **For local development** (optional):
   Create a `.dev.vars` file in the project root:
   ```
   HOST=https://pic.domain.com/
   TOKEN=your-local-dev-token
   ```
   This file should be added to `.gitignore` (secrets should never be committed).

**Environment Variables:**
- `HOST` (Secret): Public domain URL for serving images - set via `wrangler secret put HOST`
- `TOKEN` (Secret): Bearer token for API authentication - set via `wrangler secret put TOKEN`
- `MY_BUCKET` (R2 Binding): R2 bucket for file storage - configured in `wrangler.toml`

All uploads are stored under the `images/` prefix in the R2 bucket.

**For detailed configuration instructions, see `docs/CONFIGURATION.md`.**

## API Endpoints

- `GET /`: Health check (returns `{"ok": true}`)
- `POST /api/v1/upload`: Upload image (requires bearer auth, returns image URL)

## TypeScript Configuration

Using modern ESNext target with Cloudflare Workers types. JSX is configured for Hono's JSX runtime (though not currently used in this project).
