"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Calendar, AlertCircle, Trash2, Edit, Clock, Loader2 } from "lucide-react"

// Helper function to format date in IST (date only)
const formatDateTimeIST = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  dueDate: string
  description?: string
  createdAt: string
}

type NewTaskState = {
  title: string
  priority: Task["priority"]
  dueDate: string
  description: string
}

type ApiTask = {
  id: number
  title: string
  description?: string
  status: "pending" | "in_progress" | "done"
  due_date: string
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

function TaskDialogContent({
  isEdit,
  editingTask,
  onSave,
  onClose,
}: {
  isEdit?: boolean
  editingTask?: Task | null
  onSave: (task: NewTaskState | Task) => void
  onClose: () => void
}) {
  // ✅ Local form state (no parent re-renders while typing)
  const [formData, setFormData] = useState<NewTaskState>({
    title: editingTask?.title || "",
    description: editingTask?.description || "",
    priority: editingTask?.priority || "medium",
    dueDate: editingTask?.dueDate || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleChange = (field: keyof NewTaskState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (isEdit) {
      // For edit, use the existing onSave callback
      onSave({ ...editingTask, ...formData })
      onClose()
      return
    }

    // For create, call the API
    if (!formData.title.trim()) return

    setIsLoading(true)
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        title: formData.title,
        description: formData.description,
        status: "pending",
        due_date: formData.dueDate ? new Date(formData.dueDate).toISOString() : "",
        priority: formData.priority
      })

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      }

      const response = await fetch("http://127.0.0.1:8000/tasks", requestOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.text()
      console.log("Task created:", result)

      // Show success message
      setShowSuccessMessage(true)
      
      // Close dialog after a short delay
      setTimeout(() => {
        onClose()
        setShowSuccessMessage(false)
        // Reset form
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
        })
      }, 1500)

    } catch (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogContent
      className="border border-gray-500 rounded-xl"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="task-title">Task Title</Label>
          <div className="mt-2"></div>
          <Input
            id="task-title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter task title..."
                 
            />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="task-description">Description</Label>
          <div className="mt-2"></div>
          <Input
            id="task-description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter task description..."
          />
        </div>

        {/* Priority + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Priority</Label>
            <div className="mt-2"></div>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleChange("priority", value)}
            >
              <SelectTrigger className="border border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="task-date">Due Date</Label>
            <div className="mt-2"></div>
            <Input
              id="task-date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          {showSuccessMessage ? (
            <span className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Task Created!
            </span>
          ) : isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Task...
            </span>
          ) : (
            isEdit ? "Update Task" : "Create Task"
          )}
        </Button>
      </div>
    </DialogContent>
  )
}


const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review project documentation",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
    createdAt: "2024-01-10T10:00:00",
  },
  {
    id: "2",
    title: "Update user interface mockups",
    status: "pending",
    priority: "medium",
    dueDate: "2024-01-18",
    createdAt: "2024-01-11T14:30:00",
  },
  {
    id: "3",
    title: "Conduct team meeting",
    status: "done",
    priority: "high",
    dueDate: "2024-01-12",
    createdAt: "2024-01-09T09:15:00",
  },
  {
    id: "4",
    title: "Fix authentication bug",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-14",
    createdAt: "2024-01-12T16:45:00",
  },
  {
    id: "5",
    title: "Prepare quarterly report",
    status: "pending",
    priority: "medium",
    dueDate: "2024-01-20",
    createdAt: "2024-01-13T11:20:00",
  },
  {
    id: "6",
    title: "Update dependencies",
    status: "pending",
    priority: "low",
    dueDate: "2024-01-25",
    createdAt: "2024-01-14T08:00:00",
  },
]

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 5
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set())
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium" as Task["priority"],
    dueDate: "",
    description: "",
  })

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize))
  const clampedPage = Math.min(currentPage, totalPages)
  const startIndex = (clampedPage - 1) * pageSize
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize)

  // Reset to first page whenever filters or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [filterStatus, filterPriority, searchTerm])

  // Load tasks from API
  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("http://127.0.0.1:8000/tasks", {
          method: "GET",
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: ApiTask[] = await res.json()
        const normalized: Task[] = data.map((t) => ({
          id: String(t.id),
          title: t.title,
          description: t.description ?? "",
          status: t.status === "in_progress" ? "in-progress" : (t.status as any),
          priority: t.priority,
          dueDate: t.due_date,
          createdAt: t.created_at,
        }))
        setTasks(normalized)
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message || "Failed to load tasks")
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      status: "pending",
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      description: newTask.description,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [...prev, task])
    setNewTask({ title: "", priority: "medium", dueDate: "", description: "" })
    setIsAddTaskOpen(false)
  }

  const handleEditTask = () => {
    if (!editingTask || !editingTask.title.trim()) return

    setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? editingTask : task)))
    setEditingTask(null)
  }

  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId))
    
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        status: newStatus === "in-progress" ? "in_progress" : newStatus
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      }

      const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, requestOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.text()
      console.log("Status updated:", result)

      // Update local state
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update task status. Please try again.")
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const updateTaskPriority = async (taskId: string, newPriority: Task["priority"]) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId))
    
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        priority: newPriority
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      }

      const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, requestOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.text()
      console.log("Priority updated:", result)

      // Update local state
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, priority: newPriority } : task)))

    } catch (error) {
      console.error("Error updating priority:", error)
      alert("Failed to update task priority. Please try again.")
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const updateTaskStatusAndPriority = async (taskId: string, newStatus: Task["status"], newPriority: Task["priority"]) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId))
    
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        status: newStatus === "in-progress" ? "in_progress" : newStatus,
        priority: newPriority
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      }

      const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, requestOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.text()
      console.log("Status and Priority updated:", result)

      // Update local state
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus, priority: newPriority } : task)))

    } catch (error) {
      console.error("Error updating status and priority:", error)
      alert("Failed to update task. Please try again.")
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
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

  const TaskDialog = ({ task, isEdit = false }: { task?: Task; isEdit?: boolean }) => (
    <DialogContent
      className="border border-gray-500 rounded-xl"
      onOpenAutoFocus={(e) => e.preventDefault()}
    
    >
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
      </DialogHeader>
      <DialogDescription className="sr-only">
        {isEdit ? "Update fields and click Update Task" : "Fill the fields and click Create Task to add a new task"}
      </DialogDescription>
      <form onSubmit={(e) => e.preventDefault()} >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Label htmlFor="task-title">Task Title</Label>
          <Input
            id="task-title"
            value={isEdit ? editingTask?.title || "" : newTask.title}
            onChange={(e) =>
              isEdit
                ? setEditingTask((prev) => (prev ? { ...prev, title: e.target.value } : null))
                : setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter task title..."
          />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Label htmlFor="task-description">Description</Label>
          <Input
            id="task-description"
            value={isEdit ? editingTask?.description || "" : newTask.description}
            onChange={(e) =>
              isEdit
                ? setEditingTask((prev) => (prev ? { ...prev, description: e.target.value } : null))
                : setNewTask((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter task description..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Label htmlFor="task-priority">Priority</Label>
          <Select
            value={isEdit ? editingTask?.priority || "medium" : newTask.priority}
            onValueChange={(value: Task["priority"]) =>
              isEdit
                ? setEditingTask((prev) => (prev ? { ...prev, priority: value } : null))
                : setNewTask((prev) => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger className="border border-gray-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-1 gap-3">
          <Label htmlFor="task-date">Due Date</Label>
          <Input
            id="task-date"
            type="date"
            value={isEdit ? editingTask?.dueDate || "" : newTask.dueDate}
            onChange={(e) =>
              isEdit
                ? setEditingTask((prev) => (prev ? { ...prev, dueDate: e.target.value } : null))
                : setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))
            }
          />
          </div>
        </div>
        <Button type="button" onClick={isEdit ? handleEditTask : handleAddTask} className="w-full bg-primary hover:bg-primary/90">
          {isEdit ? "Update Task" : "Create Task"}
        </Button>
      </div>
      </form>
    </DialogContent>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
          <p className="text-muted-foreground">Manage and track your tasks efficiently</p>
        </div>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <TaskDialogContent
            onSave={() => {}} // Not used for create, API handles it
            onClose={() => {
              setIsAddTaskOpen(false)
              // Refresh the task list after creating
              const load = async () => {
                try {
                  setLoading(true)
                  setError(null)
                  const res = await fetch("http://127.0.0.1:8000/tasks", {
                    method: "GET",
                  })
                  if (!res.ok) throw new Error(`HTTP ${res.status}`)
                  const data: ApiTask[] = await res.json()
                  const normalized: Task[] = data.map((t) => ({
                    id: String(t.id),
                    title: t.title,
                    description: t.description ?? "",
                    status: t.status === "in_progress" ? "in-progress" : (t.status as any),
                    priority: t.priority,
                    dueDate: t.due_date,
                    createdAt: t.created_at,
                  }))
                  setTasks(normalized)
                } catch (e: any) {
                  setError(e?.message || "Failed to load tasks")
                } finally {
                  setLoading(false)
                }
              }
              load()
            }}
          />
        </Dialog>

      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 border border-gray-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32 border border-gray-500">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">Loading tasks…</div>
      )}
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <Table className="table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[10%]" />
            </colgroup>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="text-left">Title</TableHead>
                <TableHead className="text-left">Description</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Priority</TableHead> 
                <TableHead className="text-center">Due Date</TableHead>
                <TableHead className="text-center">Created At</TableHead>
                <TableHead className="text-right pr-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.map((task) => (
                <TableRow key={task.id} className="odd:bg-muted/20">
                  <TableCell>
                    <div>
                      <div className="font-medium truncate pr-4" title={task.title}>{task.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground line-clamp-2" title={task.description}>{task.description}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {updatingTasks.has(task.id) ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Updating...</span>
                      </div>
                    ) : (
                      <Badge className={getStatusColor(task.status)} variant="outline">
                        {task.status.replace("-", " ")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {updatingTasks.has(task.id) ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Updating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <AlertCircle className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                        <span className="capitalize">{task.priority}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{formatDateTimeIST(task.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                          value={task.status}
                          onValueChange={(value) =>
                            updateTaskStatus(task.id, value as Task["status"])
                          }
                        >
                          <DropdownMenuRadioItem value="pending" disabled={updatingTasks.has(task.id)}>
                            {updatingTasks.has(task.id) ? "Updating..." : "Pending"}
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="in-progress" disabled={updatingTasks.has(task.id)}>
                            {updatingTasks.has(task.id) ? "Updating..." : "In Progress"}
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="done" disabled={updatingTasks.has(task.id)}>
                            {updatingTasks.has(task.id) ? "Updating..." : "Done"}
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                          value={task.priority}
                          onValueChange={(value) =>
                            updateTaskPriority(task.id, value as Task["priority"])
                          }
                        >
                          <DropdownMenuRadioItem value="low" disabled={updatingTasks.has(task.id)}>
                            {updatingTasks.has(task.id) ? "Updating..." : "Low"}
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="medium" disabled={updatingTasks.has(task.id)}>
                            {updatingTasks.has(task.id) ? "Updating..." : "Medium"}
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="high" disabled={updatingTasks.has(task.id)}>
                            {updatingTasks.has(task.id) ? "Updating..." : "High"}
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem onClick={() => setEditingTask(task)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{task.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={task.status}
                      onValueChange={(value) =>
                        updateTaskStatus(task.id, value as Task["status"])
                      }
                    >
                      <DropdownMenuRadioItem value="pending" disabled={updatingTasks.has(task.id)}>
                        {updatingTasks.has(task.id) ? "Updating..." : "Pending"}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="in-progress" disabled={updatingTasks.has(task.id)}>
                        {updatingTasks.has(task.id) ? "Updating..." : "In Progress"}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="done" disabled={updatingTasks.has(task.id)}>
                        {updatingTasks.has(task.id) ? "Updating..." : "Done"}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={task.priority}
                      onValueChange={(value) =>
                        updateTaskPriority(task.id, value as Task["priority"])
                      }
                    >
                      <DropdownMenuRadioItem value="low" disabled={updatingTasks.has(task.id)}>
                        {updatingTasks.has(task.id) ? "Updating..." : "Low"}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="medium" disabled={updatingTasks.has(task.id)}>
                        {updatingTasks.has(task.id) ? "Updating..." : "Medium"}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="high" disabled={updatingTasks.has(task.id)}>
                        {updatingTasks.has(task.id) ? "Updating..." : "High"}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditingTask(task)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {updatingTasks.has(task.id) ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Updating...</span>
                  </div>
                ) : (
                  <>
                    <Badge className={getStatusColor(task.status)} variant="outline">
                      {task.status.replace("-", " ")}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <AlertCircle className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                      <span className="text-sm capitalize">{task.priority}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Created: {formatDateTimeIST(task.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage((p) => Math.max(1, p - 1))
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === clampedPage}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage(page)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
  <TaskDialogContent
    isEdit
    editingTask={editingTask}
    onSave={(updatedTask) => {
      if ('id' in updatedTask) {
        setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask as Task : t)))
      }
    }}
    onClose={() => setEditingTask(null)}
  />
</Dialog>

    </div>
  )
}
