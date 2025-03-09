import type { SecretStorage } from 'vscode'
import { extensionContext } from 'reactive-vscode'
import { logger } from '../utils'

const API_KEY_STORAGE_KEY = 'cursor.apiKey'

export async function saveApiKey(apiKey: string): Promise<void> {
  try {
    if (!extensionContext.value) {
      throw new Error('Extension context not initialized')
    }
    const secretStorage: SecretStorage = extensionContext.value.secrets
    await secretStorage.store(API_KEY_STORAGE_KEY, apiKey)
    logger.info('API key saved successfully')
  }
  catch (error) {
    logger.error('Failed to save API key:', error)
    throw error
  }
}

export async function getApiKey(): Promise<string | undefined> {
  try {
    if (!extensionContext.value) {
      throw new Error('Extension context not initialized')
    }
    const secretStorage: SecretStorage = extensionContext.value.secrets
    return await secretStorage.get(API_KEY_STORAGE_KEY)
  }
  catch (error) {
    logger.error('Failed to get API key:', error)
    return undefined
  }
}

export async function clearApiKey(): Promise<void> {
  try {
    if (!extensionContext.value) {
      throw new Error('Extension context not initialized')
    }
    const secretStorage: SecretStorage = extensionContext.value.secrets
    await secretStorage.delete(API_KEY_STORAGE_KEY)
    logger.info('API key cleared successfully')
  }
  catch (error) {
    logger.error('Failed to clear API key:', error)
    throw error
  }
}
