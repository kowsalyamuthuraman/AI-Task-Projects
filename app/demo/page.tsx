"use client"

import dynamic from "next/dynamic"

const DemoRequestForm = dynamic(() => import("@/components/demo-request-form").then(m => m.DemoRequestForm), { ssr: false })

export default function DemoPage() {
  return <DemoRequestForm fullscreen />
}



