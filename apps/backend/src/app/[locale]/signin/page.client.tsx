'use client'

import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'
import { useUser } from '@/providers/userProvider'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Link, useRouter } from '@/i18n/routing'
import { ShineBorder } from '@/components/magicui/shine-border'

function ThingsToDoAfterSignIn(props: { filePath?: string }) {
  const t = useTranslations()
  const thingsToDoAfterSignIn = [
    {
      label: t('signin.returnToCursor'),
      href: `cursor://file/${props.filePath}`,
      enabled: !!props.filePath,
    },
  ]
  const enabledThingsToDoAfterSignIn = thingsToDoAfterSignIn.filter((thing) => thing.enabled)
  if (enabledThingsToDoAfterSignIn.length === 0) return null
  return (
    <div>
      <p>{t('signin.thingsToDoAfterSignIn')}</p>
      <ul>
        {thingsToDoAfterSignIn.map(
          (thing) =>
            thing.enabled && (
              <li key={thing.label}>
                <Button variant="link" asChild>
                  <a href={thing.href} target="_blank" rel="noopener noreferrer">
                    {thing.label}
                  </a>
                </Button>
              </li>
            ),
        )}
      </ul>
    </div>
  )
}

export default function SignInPage() {
  const { user } = useUser()
  const t = useTranslations()
  const searchParams = useSearchParams()
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string>()

  const isFromExtension = searchParams.get('source') === 'extension'
  const filePath = searchParams.get('filePath')
  const port = searchParams.get('port')
  const router = useRouter()
  const connectToExtension = async () => {
    if (!port || !user?.apiKey) return

    setConnecting(true)
    setError(undefined)

    try {
      const response = await fetch(`http://localhost:${port}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: user.apiKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to connect to extension')
      }

      setConnected(true)
    } catch (_err) {
      setError(t('signin.connectionError'))
    } finally {
      setConnecting(false)
    }
  }

  const handleCancel = () => {
    router.replace({
      pathname: '/',
    })
  }

  if (user && isFromExtension) {
    return (
      <div className="container relative flex flex-col items-center justify-start gap-4 h-full">
        <Card className="w-full max-w-xl mt-10 relative overflow-hidden">
          <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} borderWidth={2} />
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {!connected ? t('signin.connectToExtension') : t('signin.canCloseWindow')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-1.5">
            {!connected ? (
              <>
                <p className="text-muted-foreground">{t('signin.youAreLoggedInWith')}</p>
                <Input value={user.email} disabled />
              </>
            ) : (
              <ThingsToDoAfterSignIn filePath={filePath ?? undefined} />
            )}
          </CardContent>
          <Separator />
          <CardFooter>
            {!connected ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2 justify-between">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="flex-1 uppercase font-bold"
                    size="lg"
                  >
                    {t('signin.cancel')}
                  </Button>
                  <Button
                    onClick={connectToExtension}
                    disabled={connecting}
                    className="flex-1 uppercase font-bold"
                    size="lg"
                  >
                    {connecting ? t('signin.connecting') : t('signin.connect')}
                  </Button>
                </div>
                {error && <p className="text-destructive">{error}</p>}
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-between w-full">
                {filePath && (
                  <Button
                    variant="secondary"
                    className="flex-1 uppercase font-bold"
                    size="lg"
                    asChild
                  >
                    <a href={`cursor://file/${filePath}`} target="_blank" rel="noopener noreferrer">
                      {t('signin.returnToCursor')}
                    </a>
                  </Button>
                )}
                <Button className="flex-1 uppercase font-bold" size="lg">
                  <Link href="/rules">{t('signin.goExploreRules')}</Link>
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container relative flex items-center justify-center h-full">
      <SocialAuthButtons />
    </div>
  )
}
