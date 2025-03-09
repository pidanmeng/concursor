import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'

type isAdminUser = (args: AccessArgs<User>) => boolean

export const adminUser: isAdminUser = ({ req: { user } }) => {
  return Boolean(user?.collection === COLLECTION_SLUGS.ADMIN_USERS)
}
