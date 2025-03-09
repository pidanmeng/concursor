export const COLLECTION_SLUGS = {
  MEDIA: 'media',
  USERS: 'users',
  ADMIN_USERS: 'admin-users',
  RULES: 'rules',
  TAGS: 'tags',
  PACKAGES: 'packages',
  FAVORITES: 'favorites',
} as const

export type CollectionSlug = typeof COLLECTION_SLUGS[keyof typeof COLLECTION_SLUGS]
export const allCollectionSlugs = Object.values(COLLECTION_SLUGS)
