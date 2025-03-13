'use server'

import { getPayload } from 'payload'
import { getUser } from '@/actions/auth'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { Project } from '@/payload-types'
import payloadConfig from '@/payload.config'

// 获取当前用户的项目列表
export async function getProjects(): Promise<Project[]> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const projects = await payload.find({
      collection: COLLECTION_SLUGS.PROJECTS,
      where: {
        'creator.value': {
          equals: user.id,
        },
        obsolete: {
          equals: false,
        },
      },
      sort: '-updatedAt',
    })

    return projects.docs as Project[]
  } catch (error) {
    console.error('获取项目列表失败:', error)
    throw new Error('Failed to get projects')
  }
}

// 根据ID获取单个项目
export async function getProject(id: string): Promise<Project> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const project = await payload.findByID({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
    })

    // 检查当前用户是否是项目创建者
    if (
      project?.creator?.value &&
      typeof project.creator.value === 'string' &&
      project.creator.value !== user.id
    ) {
      throw new Error('无权访问此项目')
    }

    return project as Project
  } catch (error) {
    console.error('获取项目详情失败:', error)
    throw new Error('Failed to get project')
  }
}

// 搜索项目
export async function searchProjects(query: string): Promise<Project[]> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const projects = await payload.find({
      collection: COLLECTION_SLUGS.PROJECTS,
      where: {
        'creator.value': {
          equals: user.id,
        },
        obsolete: {
          equals: false,
        },
        title: {
          like: query,
        },
      },
      sort: '-updatedAt',
    })

    return projects.docs as Project[]
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
    throw new Error('User not authenticated')
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
    throw new Error('User not authenticated')
  }

  try {
    // 检查当前用户是否是项目创建者
    const existingProject = await payload.findByID({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
    })

    if (
      existingProject?.creator?.value &&
      typeof existingProject.creator.value === 'string' &&
      existingProject.creator.value !== user.id
    ) {
      throw new Error('无权修改此项目')
    }

    const project = await payload.update({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
      data,
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
    throw new Error('User not authenticated')
  }

  try {
    // 检查当前用户是否是项目创建者
    const existingProject = await payload.findByID({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
    })

    if (
      existingProject?.creator?.value &&
      typeof existingProject.creator.value === 'string' &&
      existingProject.creator.value !== user.id
    ) {
      throw new Error('无权删除此项目')
    }

    // 使用软删除
    await payload.update({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
      data: {
        obsolete: true,
      },
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
    throw new Error('User not authenticated')
  }

  try {
    // 获取原项目
    const sourceProject = await payload.findByID({
      collection: COLLECTION_SLUGS.PROJECTS,
      id,
      depth: 0,
    }) as Project

    if (
      sourceProject?.creator?.value &&
      typeof sourceProject.creator.value === 'string' &&
      sourceProject.creator.value !== user.id
    ) {
      throw new Error('无权复制此项目')
    }

    // 创建项目副本
    const newProject = await payload.create({
      collection: COLLECTION_SLUGS.PROJECTS,
      data: {
        title: `${sourceProject.title} (副本)`,
        description: sourceProject.description,
        tags: sourceProject.tags,
        rules: sourceProject.rules,
        creator: { value: user.id, relationTo: COLLECTION_SLUGS.USERS },
        obsolete: false,
      },
    })

    return newProject as Project
  } catch (error) {
    console.error('复制项目失败:', error)
    throw new Error('Failed to duplicate project')
  }
} 