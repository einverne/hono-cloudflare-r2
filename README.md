# hono-cloudflare-r2

Upload image to Cloudflare R2 using Hono and Cloudflare Workers.

```
pnpm install
pnpm run dev
```

Run the following command to deploy the project to Cloudflare Workers.

If you run this command the first time, you will be asked to log in to your Cloudflare account.

```
pnpm run deploy
```

## Config

Update `wrangler.toml` with your own Cloudflare information.

```
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "your-bucket-name"
```

Update `config.ts` with your own Host and Token.
