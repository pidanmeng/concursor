'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { useUser } from '@/providers/userProvider'
import { Github } from 'lucide-react'

export default function HomePage() {
  const t = useTranslations()
  const user = useUser()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            {t('landing.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg">
              {t('landing.hero.getStarted')}
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              <Github className="mr-2 h-5 w-5" />
              {t('landing.hero.github')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('landing.features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('landing.features.manage.title')}</CardTitle>
                <CardDescription>{t('landing.features.manage.description')}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('landing.features.share.title')}</CardTitle>
                <CardDescription>{t('landing.features.share.description')}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('landing.features.sync.title')}</CardTitle>
                <CardDescription>{t('landing.features.sync.description')}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('landing.howItWorks.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">{t('landing.howItWorks.step1.title')}</h3>
              <p className="text-muted-foreground mb-6">{t('landing.howItWorks.step1.description')}</p>
              <h3 className="text-2xl font-semibold mb-4">{t('landing.howItWorks.step2.title')}</h3>
              <p className="text-muted-foreground mb-6">{t('landing.howItWorks.step2.description')}</p>
              <h3 className="text-2xl font-semibold mb-4">{t('landing.howItWorks.step3.title')}</h3>
              <p className="text-muted-foreground">{t('landing.howItWorks.step3.description')}</p>
            </div>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('landing.cta.description')}
          </p>
          <Button size="lg" className="text-lg">
            {t('landing.cta.button')}
          </Button>
        </div>
      </section>
    </div>
  )
}
