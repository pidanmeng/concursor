'use client'
import { useTranslations } from 'next-intl'
import React, { forwardRef, useRef } from 'react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import {
  IconArrowRight,
  IconBrain,
  IconDevices,
  IconUsers,
  IconBoxMultiple,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react'
import { BentoGrid, BentoCard, BentoCardProps } from '@/components/magicui/bento-grid'
import { TracingBeam } from '@/components/ui/tracing-beam'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Link } from '@/i18n/routing'
import { RainbowButton } from '@/components/magicui/rainbow-button'
import { useUser } from '@/providers/userProvider'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Marquee } from '@/components/magicui/marquee'
import { cn } from '@/lib/utils'
import RotatingText from '@/components/magicui/RotatingText/RotatingText'
import { CodeBlock } from '@/components/ui/code-block'
import { TagBadge, TagList } from '@/components/tag-list'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import { HugeiconsPackageOpen } from '@/components/concursorLogo'

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-card p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

Circle.displayName = 'Circle'

export function AnimatedBeamMultipleOutputDemo({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn(
        'absolute flex w-full items-start justify-center overflow-hidden py-2 h-full',
        '[mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]',
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10 w-2/3 h-2/3 py-4">
        <div className="flex flex-col justify-center gap-2">
          <TagBadge tag="Typescript" ref={div1Ref} className="z-10" />
          <TagBadge tag="React" ref={div2Ref} className="z-10" />
          <TagBadge tag="Nodejs" ref={div3Ref} className="z-10" />
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <HugeiconsPackageOpen />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle
            ref={div4Ref}
            className="bg-gradient-to-br from-[#f8b007] to-[#07f9af]"
          />
          <Circle
            ref={div5Ref}
            className="bg-gradient-to-br from-[#07E3F9] to-[#F708E4]"
          />
          <Circle
            ref={div6Ref}
            className="bg-gradient-to-br from-[#D407F8] to-[#F9D307]"
          />
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div7Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div7Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div7Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div7Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div7Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div7Ref} duration={3} />
    </div>
  )
}

function HeroSection() {
  const t = useTranslations('landing')

  return (
    <div className="h-[90vh] relative flex items-center justify-center">
      <BackgroundBeams />
      <TextHoverEffect
        text="CONCURSOR"
        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none -z-1"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-4 items-center text-center">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-foreground/60">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">{t('hero.subtitle')}</p>
          <div className="flex gap-4 mt-8">
            <RainbowButton className="gap-2 flex items-center justify-center" asChild>
              <Link href="/rules">
                {t('hero.getStarted')}
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </RainbowButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function RulesCardDemo({
  title,
  description,
  tags,
}: {
  title: string
  description: string
  tags?: string[]
}) {
  return (
    <figure
      className={cn(
        'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
        'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white ">{title}</figcaption>
        </div>
      </div>
      <TagList tags={tags} />
      <blockquote className="mt-2 text-xs">{description}</blockquote>
    </figure>
  )
}
function FeaturesSection() {
  const t = useTranslations('landing')
  const { user } = useUser()
  const mcpConfig = {
    mcpServers: {
      concursor: {
        command: 'npx',
        args: ['concursor-mcp@latest'],
        env: {
          API_KEY: user?.apiKey || '*************************',
        },
      },
    },
  }

  const cards: BentoCardProps[] = [
    {
      name: t('features.community.title'),
      description: t('features.community.description'),
      Icon: IconUsers,
      href: '/rules',
      background: (
        <Marquee
          pauseOnHover
          className="absolute py-10 h-full [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
        >
          <div className="flex gap-4">
            <RulesCardDemo
              title="React"
              description="The best way to learn React"
              tags={['react']}
            />
            <RulesCardDemo
              title="Next.js"
              description="The best practice for Next.js"
              tags={['nextjs']}
            />
            <RulesCardDemo
              title="Tailwind css"
              description="styling rules with tailwind css"
              tags={['tailwindcss']}
            />
            <RulesCardDemo
              title="Typescript"
              description="type safety with typescript"
              tags={['typescript']}
            />
          </div>
        </Marquee>
      ),
      cta: t('features.community.cta'),
      className: 'md:col-span-2',
    },
    {
      name: t('features.mcp.title'),
      description: t('features.mcp.description'),
      Icon: IconDevices,
      href: '#mcp',
      background: (
        <div className="absolute top-0 flex flex-col items-center justify-center w-full p-2 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
          <p className="font-bold flex items-center justify-center gap-2 py-2">
            <span className="pt-0.5 sm:pt-1 md:pt-2">Work with </span>
            <RotatingText
              texts={['Cursor', 'Windsurf', 'Cline']}
              mainClassName="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center"
              staggerFrom={'last'}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </p>
          <CodeBlock
            language="json"
            filename="mcp.json"
            code={JSON.stringify(mcpConfig, null, 2)}
          />
        </div>
      ),
      cta: t('features.mcp.cta'),
      className: 'md:col-span-1',
    },
    {
      name: t('features.ai.title'),
      description: t('features.ai.description'),
      Icon: IconBrain,
      href: '/generate',
      background: (
        <div className="flex-1 h-full w-full bg-gradient-to-br from-neutral-900 to-neutral-800" />
      ),
      cta: t('features.ai.cta'),
      className: 'md:col-span-1',
    },
    {
      name: t('features.sync.title'),
      description: t('features.sync.description'),
      Icon: IconBoxMultiple,
      href: '/dashboard',
      background: <AnimatedBeamMultipleOutputDemo />,
      cta: t('features.sync.cta'),
      className: 'md:col-span-2',
    },
  ]

  return (
    <div className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <BentoGrid className="max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <BentoCard key={index} {...card} />
          ))}
        </BentoGrid>
      </div>
    </div>
  )
}

function MCPUsageSection() {
  const t = useTranslations('landing')
  const { user } = useUser()
  const [copied, setCopied] = React.useState(false)

  const mcpConfig = {
    mcpServers: {
      concursor: {
        command: 'npx',
        args: ['concursor-mcp@latest'],
        env: {
          API_KEY: user?.apiKey || '*************************',
        },
      },
    },
  }

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(mcpConfig, null, 2))
    setCopied(true)
    toast.success(t('mcp.copied'))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="py-20 bg-background/50" id="mcp">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('mcp.title')}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src="/mcp-demo.gif"
              alt="MCP Usage Demo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative">
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyConfig}
                className="hover:bg-background"
              >
                {copied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto">
              <CodeBlock
                language="json"
                filename="mcp.json"
                code={JSON.stringify(mcpConfig, null, 2)}
              />
            </pre>
            {!user && (
              <p className="mt-4 text-sm text-muted-foreground">{t('mcp.loginRequired')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkflowSection() {
  const t = useTranslations('landing')

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('workflow.title')}</h2>
        <TracingBeam>
          <div className="max-w-2xl mx-auto space-y-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="relative">
                <h3 className="text-xl font-semibold mb-2">{t(`workflow.step${step}.title`)}</h3>
                <p className="text-neutral-400">{t(`workflow.step${step}.description`)}</p>
              </div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </div>
  )
}

function CTASection() {
  const t = useTranslations('landing')

  const cards = [
    {
      title: t('cta.mcp.title'),
      description: t('cta.mcp.description'),
      link: '#mcp',
    },
    {
      title: t('cta.web.title'),
      description: t('cta.web.description'),
      link: '/dashboard',
    },
    {
      title: t('cta.generate.title'),
      description: t('cta.generate.description'),
      link: '/generate',
    },
  ]

  return (
    <div className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('cta.title')}</h2>
        <HoverEffect items={cards} />
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <MCPUsageSection />
      <WorkflowSection />
      <CTASection />
    </>
  )
}
