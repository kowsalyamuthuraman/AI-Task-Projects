"use client"

import dynamic from "next/dynamic"

const SignUpForm = dynamic(() => import("@/components/sign-up-form").then(m => m.SignUpForm), { ssr: false })

export default function SignUpPage() {
  return <SignUpForm fullscreen />
}



