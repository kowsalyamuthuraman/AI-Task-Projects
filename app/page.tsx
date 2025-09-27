"use client"

import { useState, Suspense } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const LoginForm = dynamic(() => import("@/components/login-form").then(m => m.LoginForm), { ssr: false })
const SignUpForm = dynamic(() => import("@/components/sign-up-form").then(m => m.SignUpForm), { ssr: false })
const DashboardLayout = dynamic(
  () => import("@/components/dashboard-layout").then(m => m.DashboardLayout),
  { ssr: false }
)

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background to-background/80 dark:from-black dark:to-zinc-950">
        <div className="max-w-7xl mt-[9rem] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            
            <h1 className="text-4xl  md:text-5xl font-bold leading-tight text-foreground">
            Manage your tasks smarter with the power of AI. <span className="block text-primary">chat naturally and stay in sync.</span>
               
            </h1>
            <div className="flex gap-3">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                onClick={() => { setShowLogin(true); setAuthMode("signup") }}
              >
                Sign up
              </Button>
              <a href="/demo">
                <Button variant="secondary" className="cursor-pointer">Book a Demo</Button>
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <Suspense fallback={<Card className="w-full max-w-md h-[420px]" /> }>
              {showLogin ? (
                authMode === "login" ? (
                  <LoginForm onLogin={() => setIsAuthenticated(true)} fullscreen={false} />
                ) : (
                  <SignUpForm onComplete={() => setAuthMode("login")} fullscreen={false} />
                )
              ) : (
                <Card className="w-full max-w-md h-[420px] flex items-center justify-center border-dashed">
                  <span className="text-sm text-muted-foreground">Click Sign in to open login</span>
                </Card>
              )}
            </Suspense>
          </div>
        </div>

        {/* Fallback for small screens: show modal-like login card under CTA */}
        <div className="lg:hidden px-6 pb-12">
          {showLogin && (
            <Suspense fallback={<Card className="w-full h-[420px]" /> }>
              {authMode === "login" ? (
                <LoginForm onLogin={() => setIsAuthenticated(true)} fullscreen={false} />
              ) : (
                <SignUpForm onComplete={() => setAuthMode("login")} fullscreen={false} />
              )}
            </Suspense>
          )}
        </div>
      </div>
    )
  }

  return (
    <Suspense>
      <DashboardLayout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={() => setIsAuthenticated(false)}
      />
    </Suspense>
  )
}
