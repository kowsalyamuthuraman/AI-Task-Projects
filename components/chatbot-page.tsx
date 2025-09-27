"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Plus, Bot, User, Calendar, AlertCircle, CheckSquare } from "lucide-react"
import { Avatar } from "@radix-ui/react-avatar"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  dueDate: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your AI assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    content: "Hi! Can you help me create a new task for the project review?",
    sender: "user",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    content: "Of course! I can help you create a new task. What would you like to call this task, and when is it due?",
    sender: "bot",
    timestamp: new Date(Date.now() - 180000),
  },
]

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review project documentation",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Update user interface mockups",
    status: "pending",
    priority: "medium",
    dueDate: "2024-01-18",
  },
  {
    id: "3",
    title: "Conduct team meeting",
    status: "done",
    priority: "high",
    dueDate: "2024-01-12",
  },
  {
    id: "4",
    title: "Fix authentication bug",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-14",
  },
]

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [inputValue, setInputValue] = useState("")
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium" as Task["priority"],
    dueDate: "",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Typing loader component for the bot
  const BotTypingLoader: React.FC = () => (
    <span
      className="streaming-cursor"
      style={{
        display: 'inline-block',
        width: '2px',
        height: '1.2em',
        backgroundColor: '#1C6E8C',
        marginLeft: '2px',
        animation: 'cursor-blink 1s infinite'
      }}
    >
      <style>{`
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  )

  // WebSocket integration
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/chat/")
    console.log("WebSocket URL: ", "ws://127.0.0.1:8000/chat/")

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket")
      setSocket(ws)
    }

    ws.onmessage = (event) => {
      console.log("event", event)
      setIsBotTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: String(event.data),
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }

    ws.onclose = () => {
      console.log("❌ Disconnected")
      setSocket(null)
    }

    return () => {
      try { ws.close() } catch {}
    }
  }, [])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Show typing indicator until response arrives
    setIsBotTyping(true)

    // Send message via WebSocket if available
    try {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(userMessage.content)
      } else {
        console.warn("WebSocket not connected; message not sent")
      }
    } catch (err) {
      console.error("Failed to send via WebSocket", err)
      setIsBotTyping(false)
    }
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    if (input.includes("task") || input.includes("create")) {
      return "I can help you create a new task! Use the 'Add Task' button on the right panel, or tell me what you'd like to work on."
    }
    if (input.includes("status") || input.includes("progress")) {
      return "I can see your current tasks in the right panel. You have tasks that are pending, in progress, and completed. Would you like me to update any of them?"
    }
    if (input.includes("help")) {
      return "I'm here to help you manage your tasks and answer questions. You can ask me about your current tasks, create new ones, or get updates on your progress."
    }
    return (
      "I understand you're asking about: " + userInput + ". How can I assist you further with your tasks and projects?"
    )
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      status: "pending",
      priority: newTask.priority,
      dueDate: newTask.dueDate,
    }

    setTasks((prev) => [...prev, task])
    setNewTask({ title: "", priority: "medium", dueDate: "" })
    setIsAddTaskOpen(false)

    // Add bot message about task creation
    const botMessage: Message = {
      id: Date.now().toString(),
      content: `Great! I've created a new task: "${task.title}" with ${task.priority} priority. It's been added to your task list.`,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, botMessage])
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Left Panel - Chat Interface */}
      <div className="flex-1 flex flex-col border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Avatar> <Bot className="h-5 w-5 text-primary" /></Avatar>
           
            AI Assistant
          </h2>
          <p className="text-sm text-muted-foreground">Ask me anything about your tasks and projects</p>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (  
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "bot" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.sender === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Typing</span>
                      <BotTypingLoader />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 border border-gray-500 "
            />
            <Button onClick={handleSendMessage} size="icon" className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 cursor-pointer" />  
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Task Management */}
     
    </div>
  )
}
