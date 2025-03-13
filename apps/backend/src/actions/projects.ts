'use server'

import { getPayload } from 'payload'
import { getUser } from '@/actions/auth'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { Project } from '@/payload-types'
import payloadConfig from '@/payload.config'
import { getCodeMessage } from '@/constants/errorCode'

// 获取当前用户的项目列表
export async function getProjects({
  page = 1,
  limit = 9,
}: {
  page?: number
  limit?: number
} = {}): Promise<{
  docs: Project[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
}> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
  }

  try {
    const projects = await payload.find({
      collection: COLLECTION_SLUGS.PROJECTS,
      limit: limit,
      page: page,
      sort: '-updatedAt',
      overrideAccess: false,
      user,
    })

    return {
      docs: projects.docs as Project[],
      totalDocs: projects.totalDocs,
      totalPages: projects.totalPages,
      page: projects.page || 1,
      hasNextPage: projects.hasNextPage,
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
    throw new Error('Failed to get projects')
  }
}

// 根据ID获取单个项目
export async function getProject(id: string): Promise<Project | null> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
  }

  try {
    const project = await payload.findByID({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
      overrideAccess: false,
      user,
    })

    return project as Project
  } catch (error) {
    console.error('获取项目详情失败:', error)
    return null
  }
}

// 搜索项目
export async function searchProjects(
  query: string,
  { page = 1, limit = 9 }: { page?: number; limit?: number } = {},
): Promise<{
  docs: Project[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
}> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
  }

  try {
    const projects = await payload.find({
      collection: COLLECTION_SLUGS.PROJECTS,
      page,
      limit,
      where: {
        or: [
          {
            title: {
              like: query,
            },
          },
          {
            description: {
              like: query,
            },
          },
          {
            'tags.name': {
              like: query,
            },
          },
        ],
      },
      sort: '-updatedAt',
      overrideAccess: false,
      user,
    })

    return {
      docs: projects.docs as Project[],
      totalDocs: projects.totalDocs,
      totalPages: projects.totalPages,
      page: projects.page || 1,
      hasNextPage: projects.hasNextPage,
    }
  } catch (error) {
    console.error('搜索项目失败:', error)
    throw new Error('Failed to search projects')
  }
}

// 创建项目
export async function createProject(
  data: Pick<Project, 'title' | 'description' | 'tags'>,
): Promise<Project> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
  }

  try {
    const project = await payload.create({
      collection: COLLECTION_SLUGS.PROJECTS,
      data: {
        ...data,
        creator: { value: user.id, relationTo: COLLECTION_SLUGS.USERS },
        obsolete: false,
      },
      overrideAccess: false,
      user,
    })

    return project as Project
  } catch (error) {
    console.error('创建项目失败:', error)
    throw new Error('Failed to create project')
  }
}

// 更新项目
export async function updateProject(
  id: string,
  data: Partial<Pick<Project, 'title' | 'description' | 'tags' | 'rules'>>,
): Promise<Project> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
  }

  try {
    const project = await payload.update({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
      data,
      overrideAccess: false,
      user,
    })

    return project as Project
  } catch (error) {
    console.error('更新项目失败:', error)
    throw new Error('Failed to update project')
  }
}

// 删除项目
export async function deleteProject(id: string): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
  }

  try {
    await payload.update({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
      data: {
        obsolete: true,
      },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    console.error('删除项目失败:', error)
    throw new Error('Failed to delete project')
  }
}

// 复制项目
export async function duplicateProject(id: string): Promise<Project> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
  }

  try {
    const sourceProject = (await payload.duplicate({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
      overrideAccess: false,
      user,
    })) as Project

    return sourceProject as Project
  } catch (error) {
    console.error('复制项目失败:', error)
    throw new Error('Failed to duplicate project')
  }
}
