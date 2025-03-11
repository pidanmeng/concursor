import type { Field } from 'payload'
import { deepMerge } from '@concursor/utils'

export function privateField({ override }: { override?: Partial<Field> } = {}): Field {
  const defaultConfig: Field = {
    name: 'private',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    admin: {
      position: 'sidebar',
    },
  }

  return deepMerge(defaultConfig, override)
}
