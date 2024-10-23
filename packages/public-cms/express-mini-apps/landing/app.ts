import { default as express } from 'express'
import { KeystoneContext } from '@keystone-6/core/types'
import path from 'path'

export function createLandingMiniApp({
  keystoneContext,
}: {
  keystoneContext: KeystoneContext
}) {
  const router = express.Router()

  router.get('/landing/img/:filename', (req, res, next) => {
    const options = {
      root: path.resolve(process.cwd(), './express-mini-apps/landing/img'),
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    }
    const filename = req.params.filename
    res.sendFile(filename, options, function (err: Error) {
      if (err) {
        next(err)
      }
    })
  })

  router.get('/landing', (req, res, next) => {
    const options = {
      root: path.resolve(process.cwd(), './express-mini-apps/landing/'),
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    }
    const filename = 'index.html'
    res.sendFile(filename, options, function (err: Error) {
      if (err) {
        console.log('err?')
        next(err)
      }
    })
  })

  router.get('/', async (req, res, next) => {
    const context = await keystoneContext.withRequest(req, res)
    // User has been logged in
    if (!context?.session?.data) {
      return res.redirect('/landing')
    }

    next()
  })

  return router
}
