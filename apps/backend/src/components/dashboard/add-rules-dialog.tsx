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
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { createRule } from '@/actions/dashboard'
import { Rule } from '@/payload-types'

// 定义表单验证模式
const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  globs: z.string().optional(),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
  private: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface AddRulesBtnProps {
  onSuccess?: (rule: Rule) => void
  children?: React.ReactNode
}

export function AddRulesDialog({ onSuccess, children }: AddRulesBtnProps) {
  const t = useTranslations('dashboard.addRule')
  const [open, setOpen] = useState(false)

  // 初始化表单
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      globs: '',
      content: '',
      private: false,
    },
  })

  // 表单提交处理
  const onSubmit = async (values: FormValues) => {
    try {
      const rule = await createRule(values)
      onSuccess?.(rule)
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error('Failed to create rule:', error)
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
                      <Input placeholder={t('placeholders.description')} {...field} />
                    </FormControl>
                    <FormDescription>{t('formDescriptions.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="globs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabels.globs')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('placeholders.globs')} {...field} />
                    </FormControl>
                    <FormDescription>{t('formDescriptions.globs')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabels.content')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('placeholders.content')}
                        className="h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="private"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t('formLabels.private')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">{t('confirm')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
