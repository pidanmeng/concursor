'use client'

import { addCollection, IconifyJSON } from "@iconify/react"
import icons from '@iconify-json/logos/icons.json'

import { Icon as IconifyIcon, iconExists } from "@iconify/react"
import { kebabCase } from "change-case"
import { cn } from "@/lib/utils"

addCollection(icons as IconifyJSON)

interface LogoProps {
  name: string;
  className?: string;
}
export const Logo = ({ name, className }: LogoProps) => {
  let iconName = ''
  // 尝试不同的图标名称格式
  const tryIconNames = [
    name,
    `logos:${kebabCase(name)}-icon`,
    `logos:${kebabCase(name)}`,
  ]

  // 查找第一个存在的图标
  for (const tryName of tryIconNames) {
    if (iconExists(tryName)) {
      iconName = tryName
      break
    }
  }

  if (!iconName) {
    console.warn(`Icon not found: ${name}, tried: ${tryIconNames.join(', ')}`)
    return null
  }

  return <IconifyIcon icon={iconName} className={cn(className)} color="currentColor" fill="#fff" stroke="#fff" />
}