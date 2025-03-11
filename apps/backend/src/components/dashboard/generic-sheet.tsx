import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'
import { useState } from 'react'
import { FieldValues, Path, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { cn } from '@/lib/utils'

export interface GenericSheetProps<TFormValues extends FieldValues, TSuccessResult> {
  title: string
  description: string
  formComponent: React.ComponentType<{ form: UseFormReturn<TFormValues> }>
  submitButtonText: string
  form: UseFormReturn<TFormValues>
  onSubmit: (values: TFormValues) => Promise<TSuccessResult>
  onSuccess?: (result: TSuccessResult) => void
  children?: React.ReactNode
  previewField?: Path<TFormValues>
}

export function GenericSheet<TFormValues extends FieldValues, TSuccessResult>({
  title,
  description,
  formComponent: FormComponent,
  submitButtonText,
  form,
  onSubmit,
  onSuccess,
  children,
  previewField,
}: GenericSheetProps<TFormValues, TSuccessResult>) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslations('common')

  const handleSubmit = async (values: TFormValues) => {
    try {
      setIsSubmitting(true)
      const result = await onSubmit(values)
      onSuccess?.(result)
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error(t('errors.submitFailed'), error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const previewContent = useWatch({ control: form.control, name: previewField! })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className={cn(
          'max-w-none p-0 overflow-hidden sm:max-w-none',
          previewField ? 'w-4/5' : 'w-1/3'
        )}
      >
        <div className="flex h-full">
          <div className={cn('p-6 overflow-y-auto', previewField ? 'w-1/2' : 'w-full')}>
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                <FormComponent form={form} />
                <SheetFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('submitting') : submitButtonText}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </div>

          {previewField && (
            <div className={cn('w-1/2 border-l border-border p-6 bg-muted/30 overflow-y-auto')}>
              <div className="sticky top-0 z-10 pb-2 mb-4">
                <h3 className="text-lg font-medium">{t('preview')}</h3>
              </div>
              <MarkdownPreview
                source={previewContent}
                className="h-full"
                style={{
                  backgroundColor: 'transparent',
                  padding: 0,
                }}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
