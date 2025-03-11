import type { User } from '../../../backend/src/payload-types'
import { ref } from 'reactive-vscode'

export const currentUser = ref<User | null>(null)
