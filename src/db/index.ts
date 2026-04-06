import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

declare global {
  var Netlify: any
}

export function getDb() {
  const url =
    (typeof Netlify !== 'undefined'
      ? Netlify.env.get('DATABASE_URL')
      : process.env.DATABASE_URL) || ''

  const sql = neon(url)
  return drizzle(sql, { schema })
}
export { schema }
