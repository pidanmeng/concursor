import type { Access } from 'payload'

export const or: (accesses: Access[]) => Access = (accesses) => {
  return async (args) => {
    const results = await Promise.all(accesses.map((access) => access(args)))
    const anywayAllowed = results.some((result) => result === true)
    if (anywayAllowed) return true
    const wheres = results.filter((result) => typeof result === 'object')
    if (wheres.length === 0) return false
    return {
      or: wheres,
    }
  }
}

export const and: (accesses: Access[]) => Access = (accesses) => {
  return async (args) => {
    const results = await Promise.all(accesses.map((access) => access(args)))
    const anywayRejected = results.some((result) => result === false)
    if (anywayRejected) return false
    const wheres = results.filter((result) => typeof result === 'object')
    if (wheres.length === 0) return true
    return {
      and: wheres,
    }
  }
}
