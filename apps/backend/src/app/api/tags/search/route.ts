import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@concursor/api'
import payloadConfig from '@/payload.config'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q')
  
  if (!q) {
    return NextResponse.json({ docs: [] })
  }

  try {
    const payload = getPayload()
    
    // 使用TagsSearch集合进行搜索
    const results = await payload.find({
      collection: COLLECTION_SLUGS.TAGS_SEARCH,
      where: {
        name: {
          contains: q,
        },
      },
      limit: 10,
    })

    return NextResponse.json({ docs: results.docs })
  } catch (error) {
    console.error('Error searching tags:', error)
    return NextResponse.json({ error: 'Failed to search tags' }, { status: 500 })
  }
} 