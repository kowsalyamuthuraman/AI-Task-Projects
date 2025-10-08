# AI-Powered Task Management App - Frontend Dashboard

A modern, responsive task management application built with Next.js 14, featuring an AI chatbot assistant, real-time task management, and comprehensive dashboard analytics.
**1.SIGN IN PAGE**
<img width="1872" height="909" alt="image" src="https://github.com/user-attachments/assets/8e43e2fd-18cd-4f45-a295-f898dcd0098c" />

**2.SIGN UP PAGE**
<img width="1889" height="980" alt="image" src="https://github.com/user-attachments/assets/fd302b36-0270-4bed-910c-60f7e8c2bd22" />

**3. DASHBOARD PAGE**
<img width="1909" height="999" alt="image" src="https://github.com/user-attachments/assets/b3cbc046-806b-420a-8032-e1d4ad044667" />

**4.CHATBOT PAGE**
<img width="1916" height="1023" alt="image" src="https://github.com/user-attachments/assets/47ccdb39-415a-4fdd-af24-7fae63f59412" />

**5.TASKLIST PAGE**
<img width="1918" height="900" alt="image" src="https://github.com/user-attachments/assets/cc7e6f7c-81b2-465c-bce6-e8f3133060ab" />

**6.TASK CREATION PAGE**
<img width="1915" height="965" alt="image" src="https://github.com/user-attachments/assets/c67c02fb-e906-4650-941a-ea48b2231128" />

**7.TASK UPDATE(PRIORITY,STATUS)**
<img width="1908" height="875" alt="image" src="https://github.com/user-attachments/assets/1c761a4f-797f-4523-afd9-2981f1da9e1b" />


## 🚀 Features

### 📊 Dashboard
- **Real-time Analytics**: Task status distribution, weekly activity charts
- **Key Metrics**: Total tasks, completion rates, priority breakdown
- **Interactive Charts**: Bar charts, pie charts, and line graphs using Recharts
- **Responsive Design**: Optimized for desktop and mobile devices

### 📝 Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Status Management**: Pending, In Progress, Done with real-time updates
- **Priority Levels**: Low, Medium, High priority classification
- **Due Date Tracking**: Calendar integration with IST timezone support
- **Search & Filter**: Advanced filtering by status, priority, and text search
- **Pagination**: Efficient data handling with 5 items per page
- **Bulk Actions**: Update multiple tasks simultaneously

### 🤖 AI Chatbot Assistant
- **WebSocket Integration**: Real-time communication with backend AI service
- **Natural Language Processing**: Understands task-related queries
- **Typing Indicators**: Visual feedback during AI response generation
- **Context Awareness**: Maintains conversation history and context
- **Task Integration**: Can create and manage tasks through conversation

### 🎨 User Interface
- **Modern Design**: Clean, professional interface with dark/light theme support
- **Component Library**: Built with Radix UI primitives and Tailwind CSS
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Responsive Layout**: Mobile-first design with adaptive layouts
- **Loading States**: Comprehensive loading indicators and error handling

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **React 18**: Modern React with hooks and concurrent features

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **Class Variance Authority**: Component variant management
- **Tailwind Merge**: Utility class merging

### Data Visualization
- **Recharts**: Responsive charts and graphs
- **Date-fns**: Date manipulation utilities

### State Management
- **React Hooks**: useState, useEffect, useRef
- **Custom Hooks**: Theme management, mobile detection, toast notifications

### API Integration
- **Fetch API**: RESTful API communication
- **WebSocket**: Real-time chat functionality
- **AbortController**: Request cancellation and cleanup

## 📁 Project Structure

```
frontend-dashboard/
├── app/                          # Next.js App Router
│   ├── demo/                     # Demo page
│   ├── sign-up/                   # User registration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                    # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx            # Button component
│   │   ├── input.tsx             # Input component
│   │   ├── card.tsx              # Card component
│   │   ├── table.tsx             # Table component
│   │   ├── dialog.tsx            # Modal dialog
│   │   ├── dropdown-menu.tsx     # Dropdown menu
│   │   ├── pagination.tsx        # Pagination component
│   │   └── ...                   # Other UI components
│   ├── dashboard-page.tsx        # Main dashboard
│   ├── task-list-page.tsx        # Task management
│   ├── chatbot-page.tsx          # AI chat interface
│   ├── dashboard-layout.tsx      # Dashboard layout
│   ├── login-form.tsx            # Authentication
│   └── sign-up-form.tsx          # User registration
├── hooks/                        # Custom React hooks
│   ├── use-theme.tsx             # Theme management
│   ├── use-mobile.ts             # Mobile detection
│   └── use-toast.ts              # Toast notifications
├── lib/                          # Utility functions
│   └── utils.ts                  # Common utilities
├── public/                       # Static assets
│   ├── placeholder-logo.png      # Logo images
│   └── placeholder-user.jpg      # User avatars
├── styles/                       # Additional styles
│   └── globals.css               # Global CSS
├── components.json               # Component configuration
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Backend API server running on `http://127.0.0.1:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Integration

### REST API Endpoints
- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task status/priority
- `DELETE /tasks/{id}` - Delete task

### WebSocket Connection
- `ws://127.0.0.1:8000/chat/` - Real-time chat with AI assistant

### API Response Format
```typescript
interface Task {
  id: number
  title: string
  description?: string
  status: "pending" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  due_date: string
  created_at: string
  updated_at: string
}
```

## 🎨 Theming

The application supports both light and dark themes:
- **Automatic Detection**: Respects system preference
- **Manual Toggle**: Theme switcher in the interface
- **Persistent**: Theme choice saved in localStorage
- **CSS Variables**: Dynamic color scheme updates

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Adaptive Layout**: Different layouts for different screen sizes
- **Touch Friendly**: Optimized for touch interactions

## 🔒 Security Features

- **Input Validation**: Client-side validation with Zod schemas
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in Next.js security features
- **Secure Headers**: Content Security Policy implementation

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

## 🔮 Roadmap

- [ ] **User Authentication**: JWT-based authentication system
- [ ] **Team Collaboration**: Multi-user task sharing
- [ ] **File Attachments**: Task file uploads and management
- [ ] **Advanced Analytics**: Detailed reporting and insights
- [ ] **Mobile App**: React Native mobile application
- [ ] **Offline Support**: Progressive Web App capabilities
- [ ] **Integration APIs**: Third-party service integrations
- [ ] **Advanced AI**: Enhanced AI capabilities and automation

---

