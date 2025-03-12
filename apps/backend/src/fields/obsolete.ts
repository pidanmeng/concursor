import type { Field } from 'payload'
import { deepMerge } from '@concursor/utils'

export function obsolete({ override }: { override?: Partial<Field> } = {}): Field {
  const defaultConfig: Field = {
    admin: {
      position: 'sidebar',
    },
    label: '已废弃',
    name: 'obsolete',
    index: true,
    type: 'checkbox',
    defaultValue: false,
  }
  return deepMerge(defaultConfig, override)
}

