import { Mail, Phone, ChevronDown } from 'lucide-react'

const socials = [
  {
    name: 'Facebook',
    href: '#',
    path: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z',
  },
  {
    name: 'Twitter',
    href: '#',
    path: 'M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.2 4.2 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.9c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.2Z',
  },
  {
    name: 'LinkedIn',
    href: '#',
    path: 'M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92A1.96 1.96 0 0 0 5.25 3ZM20.5 20h-3.37v-5.87c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V20H9.55V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.06 2.26 4.06 5.2V20Z',
  },
  {
    name: 'WhatsApp',
    href: '#',
    path: 'M12.04 2C6.58 2 2.14 6.44 2.14 11.9c0 1.87.5 3.63 1.44 5.15L2 22l5.1-1.55a9.86 9.86 0 0 0 4.94 1.33c5.46 0 9.9-4.44 9.9-9.9C21.94 6.44 17.5 2 12.04 2Zm0 18.05c-1.6 0-3.1-.44-4.4-1.28l-.31-.2-3.02.92.93-2.94-.2-.32a8.13 8.13 0 0 1-1.28-4.37c0-4.5 3.66-8.16 8.16-8.16 4.49 0 8.15 3.66 8.15 8.16 0 4.5-3.66 8.19-8.03 8.19Zm4.48-6.13c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.11-.5.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z',
  },
]

export default function TopBar() {
  return (
    <div className="hidden lg:block bg-[#0c1220]/60 text-white/85 border-b border-white/10 relative z-30">
      <div className="max-w-container mx-auto px-8 flex items-center justify-between h-11 text-sm">
        <div className="flex items-center gap-8">
          <a href="mailto:infomailexample@mail.com" className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail size={15} className="text-brand-orange" />
            infomailexample@mail.com
          </a>
          <a href="tel:+0012345678900" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone size={15} className="text-brand-orange" />
            +00 (123) 456 789 00
          </a>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
          <span className="h-4 w-px bg-white/20" />
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <span className="text-base leading-none">🇬🇧</span>
            English
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
