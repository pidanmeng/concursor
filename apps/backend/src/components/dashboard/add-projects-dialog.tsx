'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { createProject } from '@/actions/dashboard'
import { Project } from '@/payload-types'

// 定义表单验证模式
const formSchema = z.object({
  title: z.string().min(2, {
    message: '标题至少需要2个字符。',
  }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddProjectsBtnProps {
  onSuccess?: (project: Project) => void
  children?: React.ReactNode
}

export function AddProjectsDialog({ onSuccess, children }: AddProjectsBtnProps) {
  const t = useTranslations('dashboard.addProject')
  const [open, setOpen] = useState(false)

  // 初始化表单
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  // 表单提交处理
  const onSubmit = async (values: FormValues) => {
    try {
      const project = await createProject(values)
      onSuccess?.(project as Project)
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error('创建项目失败:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="max-h-[75vh] overflow-y-auto space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabels.title')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('placeholders.title')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabels.description')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('placeholders.description')} 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>{t('formDescriptions.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">{t('confirm')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 