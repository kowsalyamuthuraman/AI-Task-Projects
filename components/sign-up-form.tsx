"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SignUpFormProps {
  onComplete?: () => void
  fullscreen?: boolean
}

export function SignUpForm({ onComplete, fullscreen = true }: SignUpFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onComplete?.()
    }, 600)
  }, [name, email, password, onComplete])

  return (
    <div className={fullscreen ? "min-h-screen flex items-center justify-center p-4" : "p-0"}>
      <Card className="w-full max-w-md border border-border/50 bg-white dark:bg-white text-neutral-900 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight text-neutral-900">Create account</CardTitle>
          <CardDescription className="text-neutral-600">Start your journey with us</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-700">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-700">Email</Label>
              <Input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-700">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpForm



