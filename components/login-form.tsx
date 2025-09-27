"use client"

import type React from "react"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onLogin: () => void
  /**
   * When true, renders a full-page centered layout; when false, renders just the card.
   */
  fullscreen?: boolean
}

export function LoginForm({ onLogin, fullscreen = true }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form submit; keeps UI responsive and accessible
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!email || !password) return
      setIsSubmitting(true)
      // Mock authentication - replace with real auth flow
      setTimeout(() => {
        onLogin()
        setIsSubmitting(false)
      }, 500)
    },
    [email, password, onLogin]
  )

  return (
    <div
      className={
        fullscreen
          ? "min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/80 dark:from-black dark:to-zinc-950"
          : "p-0 bg-transparent"
      }
    >
      <Card className="w-full max-w-md border border-border/50 bg-white dark:bg-white text-neutral-900 shadow-lg">
        <CardHeader className="text-center space-y-3">
          {/* Brand */}
          <div className="flex w-full justify-center">
            <Image
              src="/placeholder-logo.svg"
              alt="App logo"
              width={40}
              height={40}
              className="opacity-90"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-neutral-900">Welcome back</CardTitle>
          <CardDescription className="text-neutral-600">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-700">Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="@example.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-100 dark:bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-16 bg-neutral-100 dark:bg-neutral-100 border-0 shadow-inner placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-[#F97316]/60 text-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 my-1 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-xs text-neutral-500">
              By continuing you agree to our Terms and Privacy Policy
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
