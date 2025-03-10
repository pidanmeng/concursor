import { AuthButton } from "./AuthButton";
import { LanguageToggle } from "./LanguageToggle";
import { ModeToggle } from "./ModeToggle";

export function HeaderToolbar() {
  return (
    <nav className="flex items-center space-x-2">
      <ModeToggle />
      <LanguageToggle />
      <AuthButton />
    </nav>
  )
}
