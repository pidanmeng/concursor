import { getServerSideURL } from '@concursor/utils'
import { getEnv } from './getEnv'

export function getBaseUrl() {
  return getEnv() === 'dev' ? 'http://localhost:3000' : getServerSideURL()
}


export function getApiBaseUrl() {
  return getEnv() === 'dev' ? 'http://localhost:3000/api' : getServerSideURL()
}
