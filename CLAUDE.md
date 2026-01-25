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
- `src/config.ts`: Configuration constants (HOST and TOKEN)
- `wrangler.toml`: Cloudflare Workers configuration including R2 bucket binding

**Key Components:**

1. **Environment Bindings** (defined in `src/index.ts:7-11`):
   - `MY_BUCKET`: R2Bucket binding for file storage
   - `USERNAME`, `PASSWORD`: (declared but not currently used)

2. **Authentication**:
   - Bearer token auth middleware applied to all `/api/*` routes
   - Token configured in `src/config.ts`

3. **Upload Flow** (`POST /api/v1/upload`):
   - Accepts multipart form data with a `file` field
   - Generates unique 10-character ID using nanoid
   - Stores file as `images/{nanoid}.{ext}` in R2
   - Returns JSON with public URL

## Configuration

**Required Setup:**

1. Update `wrangler.toml` with your Cloudflare account details:
   - Set correct `bucket_name` for your R2 bucket

2. Update `src/config.ts`:
   - `HOST`: Your public domain for serving images
   - `TOKEN`: Secret bearer token for API authentication

**R2 Bucket Binding:**
The app expects an R2 bucket bound as `MY_BUCKET` (configured in `wrangler.toml:8-10`). All uploads are stored under the `images/` prefix.

## API Endpoints

- `GET /`: Health check (returns `{"ok": true}`)
- `POST /api/v1/upload`: Upload image (requires bearer auth, returns image URL)

## TypeScript Configuration

Using modern ESNext target with Cloudflare Workers types. JSX is configured for Hono's JSX runtime (though not currently used in this project).
