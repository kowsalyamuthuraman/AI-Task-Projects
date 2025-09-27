"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface DemoRequestFormProps {
  fullscreen?: boolean
}

export function DemoRequestForm({ fullscreen = true }: DemoRequestFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !company) return
    setIsSubmitting(true)
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
    }, 700)
  }, [name, email, company])

  return (
    <div className={fullscreen ? "min-h-screen flex items-center justify-center p-4" : "p-0"}>
      <Card className="w-full max-w-xl border border-border/50 bg-white dark:bg-white text-neutral-900 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight text-neutral-900">Book a Demo</CardTitle>
          <CardDescription className="text-neutral-600">Tell us a bit about you</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center text-sm text-neutral-700">
              Thanks! We received your request. Our team will contact you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="name" className="text-neutral-700">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900" placeholder="John Doe" />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="email" className="text-neutral-700">Email</Label>
                <Input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900" placeholder="you@example.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company" className="text-neutral-700">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required className="bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900" placeholder="Acme Inc." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-neutral-700">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900" placeholder="Anything specific you'd like to see?" />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Request demo"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DemoRequestForm



