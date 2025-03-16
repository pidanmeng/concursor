import { getApiBaseUrl } from "./getBaseUrl"

export const fetchWithAuth = async (uri: string, options: RequestInit = {}) => {
  const response = await fetch(`${getApiBaseUrl()}${uri}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `users API-Key ${process.env.API_KEY}`,
    },
  })
  return response.json()
}
