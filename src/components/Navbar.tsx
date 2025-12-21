'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { User } from 'next-auth'
import { useState , useEffect } from 'react'

const positiveMessages = [
  'Honesty includes kindness too.',
  'Not all rants are negative.',
  'Good vibes are allowed here.',
  'Say what you feel — even the good stuff.',
  'Positive thoughts are welcome.',
]

function Navbar() {
  const { data: session } = useSession()
  const user: User | undefined = session?.user

  const [randomMessage, setRandomMessage] = useState<string | null>(null)

  // Run ONLY on client after hydration
  useEffect(() => {
    const message =
      positiveMessages[Math.floor(Math.random() * positiveMessages.length)]
    setRandomMessage(message)
  }, [])

  return (
    <nav className="sticky top-0 z-50">
      {/* Glow */}
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#5DA9E9] to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(93,169,233,0.12),transparent_70%)]" />

      {/* Navbar Content */}
      <div className="relative bg-black/95 backdrop-blur-xl border-b border-[#5DA9E9]/20">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Brand */}
          <Link
            href="/"
            className="text-3xl font-bold font-mono tracking-tight text-white hover:text-[#5DA9E9] transition"
          >
            Rant<span className="text-[#e472e4]">Out</span>
          </Link>

          {/* Auth Section */}
          {session ? (
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-sm text-slate-400">
                Welcome,&nbsp;
                <span className="text-[#5DA9E9] font-medium">
                  {user?.username || user?.email}
                </span>
              </span>

              <Button
                onClick={() => signOut()}
                variant="outline"
                className="border-[#000000] text-[#000000] hover:bg-[#e472e4]"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-sm text-slate-400">
                Umm Btw...... {randomMessage}
              </span>

              <Link href="/sign-in">
              <Button
                variant="outline"
                className="border-[#000000] text-[#000000] hover:bg-[#e472e4]"
              >
                Login
              </Button>
            </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
