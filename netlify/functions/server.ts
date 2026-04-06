import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start-server'
import { getRouter } from '../../src/router'

const handler = createStartHandler({
  handler: (ctx) => {
    return defaultStreamHandler({
      ...ctx,
      router: getRouter(),
    })
  },
})

export default async (request: Request) => {
  return handler(request)
}
