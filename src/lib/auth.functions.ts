import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getSessionUser } from './session.server'

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    if (!request) return null
    return await getSessionUser(request)
  },
)
