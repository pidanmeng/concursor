'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import yaml from 'js-yaml'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Copy, CheckCircle2, Download, Plus, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCompletion } from '@ai-sdk/react'
import { createRule } from '@/actions/rules'
import { getProjects, addRulesToProject } from '@/actions/projects'
import { Project } from '@/payload-types'
import { RainbowButton } from '@/components/magicui/rainbow-button'

interface GeneratedRule {
  title: string
  description: string
  content: string
}

export function GenerateClient() {
  const t = useTranslations('generate')
  const [prompt, setPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [parsedRule, setParsedRule] = useState<GeneratedRule | null>(null)
  const [streamingRule, setStreamingRule] = useState<Partial<GeneratedRule>>({})
  const [parseError, setParseError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('preview')

  const { completion: text, complete, isLoading } = useCompletion({
    api: '/api/generate',
    id: 'generate-rule',
    onResponse: () => {
      // 当收到响应时，初始化状态并打开对话框
      setStreamingRule({})
      setIsDialogOpen(true)
    },
    onFinish: (_prompt, completion) => {
      try {
        // 尝试从最终文本解析YAML
        const extractedYaml = extractYaml(completion)
        if (!extractedYaml) {
          throw new Error(t('invalidRuleFormat'))
        }

        const parsed = yaml.load(extractedYaml) as GeneratedRule

        // 验证必要的字段是否存在
        if (!parsed.title || !parsed.description || !parsed.content) {
          throw new Error(t('invalidRuleFormat'))
        }

        setParsedRule(parsed)
        setParseError(null)
      } catch (err) {
        console.error('解析YAML失败:', err)
        setParseError(t('parseError'))
        setParsedRule(null)
      }
    },
    onError: (error) => {
      console.error('生成过程中出错:', error)
      setParseError(error.message)
    },
  })

  // 使用useEffect监听text的变化来处理流式解析
  useEffect(() => {
    if (isLoading && text) {
      try {
        // 尝试从流中解析YAML
        const extractedYaml = extractYaml(text)
        if (extractedYaml) {
          const parsedYaml = yaml.load(extractedYaml) as Partial<GeneratedRule>
          setStreamingRule(parsedYaml)
        }
      } catch (err) {
        console.error('解析YAML流失败:', err)
      }
    }
  }, [text, isLoading])

  // 从文本中提取YAML内容
  const extractYaml = (text: string): string | null => {
    // 移除markdown格式的代码块标记
    const yamlText = text.replace(/^```yaml\s*/i, '').replace(/```\s*$/i, '')

    return yamlText.trim() || null
  }

  // 加载项目列表
  useEffect(() => {
    async function loadProjects() {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData.docs)
      } catch (err) {
        console.error('加载项目失败:', err)
      }
    }

    loadProjects()
  }, [])

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!prompt.trim() || isLoading) return

    setParsedRule(null)
    setStreamingRule({})
    setParseError(null)
    complete(prompt)
  }

  // 获取当前要显示的规则（已完成的或正在流式生成的）
  const displayRule = parsedRule || streamingRule

  const handleCopy = async () => {
    if (!displayRule) return

    try {
      // 创建格式化的规则文本
      const ruleText = `Rule Name: ${displayRule.title}\nDescription: ${displayRule.description}\n\n${displayRule.content}`
      await navigator.clipboard.writeText(ruleText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const handleDownload = () => {
    if (!displayRule?.title || !displayRule?.description || !displayRule?.content) return

    // 创建格式化的规则文本
    const ruleText = `Rule Name: ${displayRule.title}\nDescription: ${displayRule.description}\n\n${displayRule.content}`

    // 创建下载链接
    const blob = new Blob([ruleText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${displayRule.title.replace(/\s+/g, '-').toLowerCase()}.mdc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCreateRule = async () => {
    if (!parsedRule || isSaving) return

    setIsSaving(true)
    try {
      await createRule({
        title: parsedRule.title,
        description: parsedRule.description,
        content: `Rule Name: ${parsedRule.title}\nDescription: ${parsedRule.description}\n\n${parsedRule.content}`,
        private: false,
        globs: '',
      })

      // 关闭对话框并重置状态
      setIsDialogOpen(false)
      setParsedRule(null)
      // 显示成功消息
      toast.success(t('ruleSaved'), {
        description: t('ruleSavedDescription', { rule: parsedRule.title }),
      })
    } catch (err) {
      console.error('创建规则失败:', err)
      toast.error(t('saveError'), {
        description: t('saveErrorDescription'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddToProject = async () => {
    if (!parsedRule || !selectedProject || isSaving) return

    setIsSaving(true)
    try {
      // 先创建规则
      const rule = await createRule({
        title: parsedRule.title,
        description: parsedRule.description,
        content: `Rule Name: ${parsedRule.title}\nDescription: ${parsedRule.description}\n\n${parsedRule.content}`,
        private: false,
        globs: '',
      })

      // 然后将规则添加到项目
      await addRulesToProject(selectedProject, [rule.id])

      // 关闭对话框并重置状态
      setIsDialogOpen(false)
      setParsedRule(null)
      // 显示成功消息
      toast.success(t('ruleAddedToProject'), {
        description: t('ruleAddedToProjectDescription', {
          rule: parsedRule.title,
          project: projects.find((p) => p.id === selectedProject)?.title,
        }),
      })
    } catch (err) {
      console.error('添加规则到项目失败:', err)
      toast.error(t('saveError'), {
        description: t('saveErrorDescription'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-3xl mx-auto relative overflow-hidden">
        <BorderBeam size={100} colorFrom="#ffffff" colorTo="#000000" />

        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('inputPlaceholder')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="relative">
              <Textarea
                placeholder={t('inputPlaceholder')}
                className={cn(
                  'min-h-32 resize-none focus:ring-2 focus:ring-offset-2',
                  'transition-all duration-200 bg-background/80 backdrop-blur-sm',
                )}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {parseError && (
              <div className="rounded-md border bg-destructive/10 text-destructive p-4">
                {parseError}
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-end">
          <RainbowButton
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="relative overflow-hidden"
            type="button"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('generating')}
              </>
            ) : (
              t('generate')
            )}
          </RainbowButton>
        </CardFooter>
      </Card>

      {/* 结果模态框 */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          // 当生成中时不能关闭模态框
          if (!isLoading || parsedRule) {
            setIsDialogOpen(open)
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{displayRule?.title || t('generatedRule')}</DialogTitle>
            <DialogDescription>{displayRule?.description || ''}</DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="preview">{t('preview')}</TabsTrigger>
              <TabsTrigger value="save" disabled={isLoading || !parsedRule}>
                {t('saveOptions')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto rounded-md border p-4 bg-muted/30">
                <h3 className="text-lg font-semibold mb-1">{displayRule?.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{displayRule?.description}</p>
                <div className="whitespace-pre-wrap">
                  {displayRule?.content}
                  {isLoading && <span className="inline-block animate-pulse">▌</span>}
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!displayRule?.title || !displayRule?.content}
                  className="flex items-center"
                >
                  {copied ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? t('copied') : t('copy')}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!displayRule?.title || !displayRule?.content}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('download')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="save" className="flex-1 overflow-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">{t('createNewRule')}</h3>
                  <Button
                    onClick={handleCreateRule}
                    disabled={isSaving || !parsedRule}
                    className="w-full flex items-center justify-center"
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {t('createRule')}
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">{t('addToProject')}</h3>
                  <div className="space-y-2">
                    <Select
                      value={selectedProject}
                      onValueChange={setSelectedProject}
                      disabled={!parsedRule}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectProject')} />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={handleAddToProject}
                      disabled={!selectedProject || isSaving || !parsedRule}
                      className="w-full flex items-center justify-center"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Folder className="mr-2 h-4 w-4" />
                      )}
                      {t('addToProject')}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            {isLoading && !parsedRule ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('generating')}
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('close')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
