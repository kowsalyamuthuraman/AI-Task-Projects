"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LayoutDashboard, MessageSquare, CheckSquare, LogOut, Moon, Sun } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"
import { ChatbotPage } from "@/components/chatbot-page"
import { TaskListPage } from "@/components/task-list-page"
import { useTheme } from "@/hooks/use-theme"

interface DashboardLayoutProps {
  currentPage: string
  onPageChange: (page: string) => void
  onLogout: () => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chatbot", label: "Chatbot", icon: MessageSquare },
  { id: "tasks", label: "Task List", icon: CheckSquare },
]

export function DashboardLayout({ currentPage, onPageChange, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "chatbot":
        return <ChatbotPage />
      case "tasks":
        return <TaskListPage />
      default:
        return <DashboardPage />
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-[101%] bg-sidebar text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold">AI TASK APP </h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <Button
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    currentPage === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                  onClick={() => {
                    onPageChange(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-card border border-gray-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-primary lg:hidden">Dashboard Pro</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-90px)] border border-gray-600 ">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min- h-[calc(100vh-73px)]">{renderPage()}</main>
      </div>
    </div>
  )
}
