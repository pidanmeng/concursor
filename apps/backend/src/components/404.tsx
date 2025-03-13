'use client'

import { useParsedTheme } from '@/providers/themeProvider'
import FuzzyText from './magicui/fuzzy-text'
import { Button } from './ui/button'
import { Link } from '@/i18n/routing'

interface NotFoundProps {
  backTo?: string
  backText?: string
}

export function NotFound({ backTo, backText }: NotFoundProps) {
  const theme = useParsedTheme()
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <FuzzyText fontSize="10rem" color={theme === 'dark' ? 'white' : 'black'} enableHover={false}>
        404
      </FuzzyText>
      <FuzzyText fontSize="2rem" color={theme === 'dark' ? 'white' : 'black'} enableHover={false}>
        Page Not Found
      </FuzzyText>
      <Button variant="outline" asChild>
        <Link href={backTo || '/'}>
          <FuzzyText
            fontSize="1rem"
            color={theme === 'dark' ? 'white' : 'black'}
            baseIntensity={0.1}
            hoverIntensity={0.05}
          >
            {backText || 'Back to Home'}
          </FuzzyText>
        </Link>
      </Button>
    </div>
  )
}
