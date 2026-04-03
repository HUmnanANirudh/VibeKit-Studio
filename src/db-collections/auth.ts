import {
  createCollection,
  localOnlyCollectionOptions,
} from '@tanstack/react-db'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
})

export type AuthUser = z.infer<typeof UserSchema>

export const authUserCollection = createCollection(
  localOnlyCollectionOptions({
    getKey: (user) => user.id,
    schema: UserSchema,
  }),
)
