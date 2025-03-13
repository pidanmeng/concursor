'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, FileUp, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { TagInput } from '@/components/dashboard/tag-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { createRule } from '@/actions/rules'
import { RuleFormValues, useRuleFormSchema } from '@/forms/rule'
import { Rule } from '@/payload-types'
import { cn } from '@/lib/utils'

interface CreateRuleDialogProps {
  onSuccess: (rule: Rule) => Promise<void> | void
  buttonVariant?: 'default' | 'outline' | 'secondary'
  children?: React.ReactNode
}

interface ProcessedFile {
  file: File
  title: string
  description: string
  globs: string
  content: string
}

export function CreateRuleDialog({ 
  onSuccess, 
  buttonVariant = 'default',
  children
}: CreateRuleDialogProps) {
  const t = useTranslations('dashboard.rules')
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'form' | 'file'>('form')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [uploadError, setUploadError] = useState<string>('')
  const [isProcessingFiles, setIsProcessingFiles] = useState(false)
  
  const ruleFormSchema = useRuleFormSchema()
  
  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      globs: '',
      private: false,
      tags: [],
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    // 检查文件类型
    const invalidFiles = files.filter(
      file => !file.name.endsWith('.md') && !file.name.endsWith('.mdc')
    )
    
    if (invalidFiles.length > 0) {
      setUploadError(t('fileFormatError'))
      return
    }
    
    setUploadedFiles(files)
    setUploadError('')
    setIsProcessingFiles(true)
    
    try {
      const processed = await Promise.all(
        files.map(async (file) => {
          const content = await file.text()
          const title = file.name.replace(/\.(md|mdc)$/, '')
          
          let description = ''
          let globs = ''
          let mainContent = content
          
          // 解析metadata
          const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/)
          if (yamlMatch) {
            const metadata = yamlMatch[1]
            mainContent = yamlMatch[2]
            
            const descMatch = metadata.match(/description:\s*(.*)/)
            if (descMatch) {
              description = descMatch[1].trim()
            }
            
            const globsMatch = metadata.match(/globs:\s*(.*)/)
            if (globsMatch) {
              globs = globsMatch[1].trim()
            }
          }
          
          return {
            file,
            title,
            description,
            globs,
            content: mainContent.trim()
          }
        })
      )
      
      setProcessedFiles(processed)
      setCurrentFileIndex(0)
      updateFormWithProcessedFile(processed[0])
      
      // 切换到表单视图以便用户确认
      setActiveTab('form')
    } catch (error) {
      console.error('文件解析失败:', error)
      setUploadError(t('fileParseError'))
    } finally {
      setIsProcessingFiles(false)
    }
  }

  const updateFormWithProcessedFile = (processedFile: ProcessedFile) => {
    form.setValue('title', processedFile.title)
    form.setValue('description', processedFile.description)
    form.setValue('globs', processedFile.globs)
    form.setValue('content', processedFile.content)
  }

  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      // 保存当前表单状态到processedFiles
      const currentFormValues = form.getValues()
      const updatedProcessedFiles = [...processedFiles]
      updatedProcessedFiles[currentFileIndex] = {
        ...updatedProcessedFiles[currentFileIndex],
        title: currentFormValues.title || '',
        description: currentFormValues.description || '',
        globs: currentFormValues.globs || '',
        content: currentFormValues.content || ''
      }
      setProcessedFiles(updatedProcessedFiles)
      
      // 切换到上一个文件
      const newIndex = currentFileIndex - 1
      setCurrentFileIndex(newIndex)
      updateFormWithProcessedFile(processedFiles[newIndex])
    }
  }

  const handleNextFile = () => {
    if (currentFileIndex < processedFiles.length - 1) {
      // 保存当前表单状态到processedFiles
      const currentFormValues = form.getValues()
      const updatedProcessedFiles = [...processedFiles]
      updatedProcessedFiles[currentFileIndex] = {
        ...updatedProcessedFiles[currentFileIndex],
        title: currentFormValues.title || '',
        description: currentFormValues.description || '',
        globs: currentFormValues.globs || '',
        content: currentFormValues.content || ''
      }
      setProcessedFiles(updatedProcessedFiles)
      
      // 切换到下一个文件
      const newIndex = currentFileIndex + 1
      setCurrentFileIndex(newIndex)
      updateFormWithProcessedFile(processedFiles[newIndex])
    }
  }
  
  const handleFormSubmit = async (values: RuleFormValues) => {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      
      // 保存最后一个文件的表单状态
      const updatedProcessedFiles = [...processedFiles]
      updatedProcessedFiles[currentFileIndex] = {
        ...updatedProcessedFiles[currentFileIndex],
        title: values.title || '',
        description: values.description || '',
        globs: values.globs || '',
        content: values.content || ''
      }
      
      // 批量创建规则
      const createdRules = await Promise.all(
        updatedProcessedFiles.map(async (processedFile) => {
          const ruleValues = {
            title: processedFile.title,
            description: processedFile.description,
            globs: processedFile.globs,
            content: processedFile.content,
            private: values.private,
            tags: values.tags.map((tag) => tag.id),
          }
          
          return await createRule(ruleValues)
        })
      )
      
      // 通知父组件
      for (const rule of createdRules) {
        await onSuccess(rule)
      }
      
      toast.success(t('new.createSuccess'), {
        description: t('new.createSuccessDescription'),
      })
      
      // 关闭对话框并重置状态
      setOpen(false)
      form.reset()
      setUploadedFiles([])
      setProcessedFiles([])
      setCurrentFileIndex(0)
    } catch (error) {
      console.error('创建规则失败:', error)
      toast.error(t('new.createFailed'), {
        description: String(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value)
      if (!value) {
        form.reset()
        setUploadedFiles([])
        setProcessedFiles([])
        setCurrentFileIndex(0)
        setUploadError('')
      }
    }}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size="sm">
          {children || (
            <>
              <Plus className="w-4 h-4 mr-2" />
              {t('createRule')}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('new.title')}</DialogTitle>
          <DialogDescription>
            {t('new.description')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="form" value={activeTab} onValueChange={(v) => setActiveTab(v as 'form' | 'file')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="form">{t('form')}</TabsTrigger>
            <TabsTrigger value="file">{t('importFromFile')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4">
            {processedFiles.length > 0 && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousFile}
                  disabled={currentFileIndex === 0}
                >
                  {t('addDialog.multiFileUpload.previous')}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t('addDialog.multiFileUpload.currentFile', {
                    current: currentFileIndex + 1,
                    total: processedFiles.length
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextFile}
                  disabled={currentFileIndex === processedFiles.length - 1}
                >
                  {t('addDialog.multiFileUpload.next')}
                </Button>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('column.title')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>{t('descriptionTitle')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[100px]" 
                          placeholder={t('addDialog.descriptionPlaceholder')}
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="globs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('globs')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="*.tsx, src/**/*.json"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('addDialog.globPatternDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('content')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[200px] font-mono text-sm" 
                          placeholder={t('addDialog.contentPlaceholder')}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('column.tags')}</FormLabel>
                      <FormControl>
                        <TagInput
                          placeholder={t('addDialog.tagsPlaceholder')}
                          value={field.value}
                          onChange={(newTags) => field.onChange(newTags)}
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t('privateRule')}</FormLabel>
                        <FormDescription>
                          {t('addDialog.privateDescription')}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {processedFiles.length > 1 
                          ? t('addDialog.multiFileUpload.confirmAll')
                          : t('submitting')
                        }
                      </>
                    ) : (
                      processedFiles.length > 1 
                        ? t('addDialog.multiFileUpload.confirmAll')
                        : t('new.submit')
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {t('addDialog.multiFileUpload.title')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('addDialog.multiFileUpload.description')}
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                accept=".md,.mdc"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              
              {uploadedFiles.length > 0 ? (
                <div className="flex flex-col items-center w-full">
                  <div className="w-full space-y-2 mb-4">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={file.name}
                        className={cn(
                          "flex items-center justify-between w-full p-2 bg-muted rounded",
                          index === currentFileIndex && "border-2 border-primary"
                        )}
                      >
                        <span className="text-sm font-medium truncate max-w-xs">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => setActiveTab('form')}
                    disabled={isProcessingFiles}
                  >
                    {isProcessingFiles ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('addDialog.multiFileUpload.processing')}
                      </>
                    ) : (
                      t('continueEditing')
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="secondary" 
                  onClick={triggerFileUpload}
                >
                  {t('selectFile')}
                </Button>
              )}
              
              {uploadError && (
                <p className="text-sm text-destructive mt-2">{uploadError}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 