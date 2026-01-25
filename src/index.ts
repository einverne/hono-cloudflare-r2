import { Hono } from 'hono'
import { bearerAuth } from "hono/bearer-auth";
import { logger } from 'hono/logger'
import { nanoid } from "nanoid";

type Bindings = {
    MY_BUCKET: R2Bucket
    TOKEN: string
    HOST: string
}

const app = new Hono<{ Bindings: Bindings }>()

export const customLogger = (message: string, ...rest: string[]) => {
    console.log(message, ...rest)
}

app.use(logger(customLogger))
app.use('/api/*', async (c, next) => {
    const token = c.env.TOKEN
    if (!token) {
        return c.text('Server configuration error: TOKEN not set', 500)
    }
    return bearerAuth({token})(c, next)
})

app.notFound((c) => {
    return c.text('Not Found', 404)
})


app.get('/', (c) => {
    return c.json(
        {
            ok: true,
        }
    )
})

app.post('/api/v1/upload', async (c) => {
    const host = c.env.HOST
    if (!host) {
        return c.text('Server configuration error: HOST not set', 500)
    }

    const key = nanoid(10)
    const formData = await c.req.parseBody()
    const file = formData['file']
    if (file instanceof File) {
        const fileBuffer = await file.arrayBuffer()
        const fullName = file.name
        const ext = fullName.split('.').pop()
        const path = `images/${key}.${ext}`
        await c.env.MY_BUCKET.put(path, fileBuffer)
        return c.json({
            'image': {
                'url': `${host}${path}`
            }
        })
    } else {
        return c.text('Invalid file', 400)
    }
})

export default app
