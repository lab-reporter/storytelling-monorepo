import cors from 'cors'
import { config } from '@keystone-6/core'
import { listDefinition as lists } from './lists'
import appConfig from './config'
import envVar from './environment-variables'
import { Request, Response, NextFunction } from 'express'
import { createAuth } from '@keystone-6/auth'
import { statelessSessions } from '@keystone-6/core/session'
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache'
import express from 'express'
import path from 'path'

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  sessionData: 'name role',
  secretField: 'password',
  initFirstItem: {
    // If there are no items in the database, keystone will ask you to create
    // a new user, filling in these fields.
    fields: ['name', 'email', 'password', 'role'],
  },
})

const session = statelessSessions(appConfig.session)

export default withAuth(
  config({
    db: {
      provider: appConfig.database.provider,
      url: appConfig.database.url,
      idField: {
        kind: 'autoincrement',
      },
    },
    ui: {
      // If `isDisabled` is set to `true` then the Admin UI will be completely disabled.
      isDisabled: envVar.isUIDisabled,
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
    storage: {
      files: {
        kind: 'local',
        type: 'file',
        storagePath: appConfig.files.storagePath,
        serverRoute: {
          path: '/files',
        },
        generateUrl: (path) => `/files${path}`,
      },
      images: {
        kind: 'local',
        type: 'image',
        storagePath: appConfig.images.storagePath,
        serverRoute: {
          path: '/images',
        },
        generateUrl: (path) => `/images${path}`,
      },
    },
    graphql: {
      apolloConfig: {
        cache: new InMemoryLRUCache({
          // ~100MiB
          maxSize: Math.pow(2, 20) * envVar.memoryCacheSize,
          // 5 minutes (in milliseconds)
          ttl: envVar.memoryCacheTtl,
        }),
      },
    },
    server: {
      healthCheck: {
        path: '/health_check',
        data: { status: 'healthy' },
      },
      extendExpressApp: (app, commonContext) => {
        const corsOpts = {
          origin: envVar.cors.allowOrigins,
        }
        const corsMiddleware = cors(corsOpts)
        app.use('*', corsMiddleware)

        // Check if the request is sent by an authenticated user
        const authenticationMw = async (
          req: Request,
          res: Response,
          next: NextFunction
        ) => {
          const context = await commonContext.withRequest(req, res)

          // User has been logged in
          if (context?.session?.data?.role) {
            return next()
          }

          // Otherwise, redirect them to login page
          res.redirect('/signin')
        }

        // ThreeJS router
        app.use(
          '/three',
          // Serve static files, including js, css and html
          // BTW, the reason we use `process.cwd()` rather than `__dirname`
          // is because `__dirname` won't return the correct absolute path;
          // it return a wrong relative path `../..`.
          // I think it is a bug for `@keystone/core`.
          express.static(path.resolve(process.cwd(), './public/three'))
        )

        app.use(
          '/static',
          express.static(path.resolve(process.cwd(), './static'))
        )

        app.get(
          '/demo/scrollable-videos/:id',
          authenticationMw,
          async (req, res) => {
            const itemId = req.params.id

            const context = await commonContext.withRequest(req, res)
            const item = await context.query.ScrollableVideo.findOne({
              where: { id: itemId },
              query: 'embedCode',
            })

            if (!item) {
              return res
                .status(404)
                .send(`ScrollableVideo ${itemId} is not found`)
            }

            res.send(renderScrollableVideoHtml(item?.embedCode))
          }
        )

        app.get(
          '/demo/scroll-to-audios/:id',
          authenticationMw,
          async (req, res) => {
            const itemId = req.params.id

            const context = await commonContext.withRequest(req, res)
            const item = await context.query.ScrollToAudio.findOne({
              where: { id: itemId },
              query: 'hintEmbedCode startEmbedCode endEmbedCode',
            })

            if (!item) {
              return res
                .status(404)
                .send(`ScrollToAudio ${itemId} is not found`)
            }

            res.send(
              renderScrollToAudioHtml(
                item?.hintEmbedCode,
                item?.startEmbedCode,
                item?.endEmbedCode
              )
            )
          }
        )
      },
    },
  })
)

const renderScrollableVideoHtml = (html: string) => {
  return `
<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style> 
  * { box-sizing: border-box; } 
  body { margin:0; padding:50vh 0; font-family: 'Roboto', 'Noto Sans TC', sans-serif } 

  .article-container {
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 767px) {
    .article-container {
      width: calc(93.3333%);
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .article-container {
      width: 512px; 
    }
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    .article-container {
      width: 550px; 
    }
  }

  @media (min-width: 1440px) {
    .article-container {
      width: 730px; 
    }
  }
  </style>
</head>
<body>
  <div class="article-container">
    ${html}
  </div>
</body>
</html>
`
}

const renderScrollToAudioHtml = (
  hintEmbedCode: string,
  startEmbedCode: string,
  endEmbedCode: string
) => {
  return `
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  ${hintEmbedCode}
  <div style="margin-top: 30vh;">
    <div style="text-align: center;">捲到式聲音起始點</div>
    ${startEmbedCode}
  </div>
  <div style="width: 100%; height: 100vh; background: linear-gradient(to bottom, #fcecfc 0%,#fba6e1 48%,#fd89d7 74%,#fd89d7 74%,#ff7cd8 100%);"></div>
  <div style="width: 100%; height: 100vh; background: linear-gradient(to top, #fcecfc 0%,#fba6e1 48%,#fd89d7 74%,#fd89d7 74%,#ff7cd8 100%);"></div>
  <div style="margin-bottom: 100vh;">
    <div style="text-align: center;">捲到式聲音結束點</div>
    ${endEmbedCode}
  </div>
</body>
</html>
`
}
