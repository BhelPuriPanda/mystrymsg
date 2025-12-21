'use client'

import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from 'embla-carousel-autoplay'
import messages from '@/messages.json'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      {/* HERO */}
      <main className="relative flex flex-col items-center justify-center px-4 md:px-20 py-28 bg-gradient-to-br from-black via-[#020617] to-[#003F91] text-white overflow-hidden">

        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(93,169,233,0.12),transparent_70%)]" />

        <section className="relative text-center max-w-4xl z-10 mb-20">
          <p className="uppercase tracking-widest text-xs text-[#5DA9E9] mb-4">
            Anonymous Expression Platform
          </p>

          <h1 className="font-mono font-extrabold tracking-tight leading-tight">
            <span className="text-4xl md:text-6xl">
              Say_It… <span className="text-[#5DA9E9]">Rant_It…</span>
            </span>
            <br />
            <span className="text-[#e965e9] text-6xl md:text-9xl">
              RantOut…
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Receive completely anonymous messages — raw opinions,
            emotional rants, and honest thoughts with zero identity.
          </p>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link href="/sign-up">
              <Button className="bg-[#5DA9E9] text-black hover:bg-[#7bbbf0] font-semibold px-8">
                Get Started
              </Button>
            </Link>

            <Link href="#faq">
              <Button
                variant="outline"
                className="border-white text-white bg-black hover:bg-white hover:text-black"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative z-10 mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-mono">
            What People Are Saying
          </h2>
          <p className="text-slate-400 mt-2">
            Real messages. Zero filters.
          </p>
        </section>

        <Carousel
          className="relative w-full max-w-xl md:max-w-2xl z-10"
          plugins={[AutoPlay({ delay: 2800 })]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="bg-black/70 border border-[#5DA9E9]/30 rounded-2xl shadow-xl backdrop-blur">
                    <CardHeader className="text-center text-[#5DA9E9] text-xl font-semibold">
                      {message.title}
                    </CardHeader>

                    <CardContent className="flex justify-center text-center px-6">
                      <p className="text-lg md:text-xl font-mono text-white">
                        “{message.content}”
                      </p>
                    </CardContent>

                    <CardFooter className="text-xs text-slate-400 text-right">
                      {message.received}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      {/* FEATURES */}
      <section className="bg-black px-4 md:px-20 py-24 text-slate-200">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold font-mono">
            Why RantOut Exists
          </h2>
          <p className="mt-3 text-slate-400">
            Built for expression — not validation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            ['100% Anonymous', 'No names. No tracking.'],
            ['Raw & Honest', 'Unfiltered expression.'],
            ['Emotion First', 'Designed for rants.'],
            ['You’re in Control', 'Delete anytime.'],
            ['No Judgement', 'Speak freely.'],
            ['Privacy Focused', 'Security by design.'],
          ].map(([title, desc], i) => (
            <Card
              key={i}
              className="bg-[#020617] border border-[#5DA9E9]/30 rounded-2xl p-5 hover:border-[#5DA9E9]/60 transition"
            >
              <h3 className="text-2xl font-extrabold font-mono text-[#5DA9E9] mb-0">
                {title}
              </h3>
              <p className="text-[#ffffff] text-3xl font-thin">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#020617] px-4 md:px-20 py-32 text-slate-200">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <p className="uppercase tracking-widest text-xs text-[#5DA9E9] mb-3">
            Know Before You Rant
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold font-mono">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#5DA9E9] via-[#003F91] to-[#6D326D] opacity-30 blur-2xl" />

          <div className="relative bg-black/70 border border-[#5DA9E9]/30 rounded-3xl p-6 md:p-8 backdrop-blur">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                ['What is RantOut?', 'An anonymous messaging space for honesty.'],
                ['Is it really anonymous?', 'Yes. No identity data is stored.'],
                ['Can I delete messages?', 'Always. You’re in control.'],
                ['Who is it for?', 'Anyone who values honesty.'],
              ].map(([q, a], i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-[#5DA9E9]/20 rounded-xl px-4"
                >
                  <AccordionTrigger className="text-[#5DA9E9] text-left">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

{/* CTA */}
<section className="relative overflow-hidden py-20 text-center bg-black text-white">
  
  {/* Ambient Orbs */}
  <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#5DA9E9]/20 rounded-full blur-3xl" />
  <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#6D326D]/20 rounded-full blur-3xl" />

  {/* Glow Frame */}
  <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 rounded-3xl border border-[#5DA9E9]/30 bg-gradient-to-br from-slate-950 via-black to-slate-900 shadow-[0_0_60px_-15px_rgba(93,169,233,0.4)]">
    
    <p className="uppercase tracking-[0.35em] text-xs text-[#5DA9E9] mb-4">
      Start Your Space
    </p>

    <h2 className="text-4xl md:text-5xl font-extrabold font-mono mb-6">
      Ready to hear the{' '}
      <span className="bg-gradient-to-r from-[#5DA9E9] to-[#e472e4] bg-clip-text text-transparent">
        truth
      </span>
      ?
    </h2>

    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
      Create your RantOut link and let people speak freely —
      unfiltered, anonymous, and real.
    </p>

    <Link href="/sign-up">
      <Button
        className="relative px-10 py-6 text-lg font-semibold bg-black text-white border border-[#5DA9E9]/40 rounded-xl
                   hover:shadow-[0_0_30px_rgba(93,169,233,0.6)]
                   hover:border-[#5DA9E9]
                   transition-all duration-300"
      >
        Create or Login to RantOut
      </Button>
    </Link>
  </div>
</section>



      <footer className="bg-black text-center py-6 text-slate-500 text-sm">
        © 2025 RantOut. Built for unfiltered honesty.
      </footer>
    </>
  )
}

export default Home
