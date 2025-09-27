# AI-Powered Task Management App - Backend

A FastAPI-based backend application for managing tasks with AI assistance using Google's Generative AI.

## Features

- ✅ **RESTful API** for task management (CRUD operations)
- 🤖 **AI Chat Integration** via WebSocket using Google Generative AI
- 🗄️ **PostgreSQL Database** with SQLAlchemy ORM
- 🔒 **Environment-based Configuration** for security
- 📝 **Comprehensive Error Handling** and logging
- 🌐 **CORS Support** for frontend integration
- 📚 **Auto-generated API Documentation** (Swagger UI)

## API Endpoints

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/{task_id}` - Get a specific task
- `PUT /api/v1/tasks/{task_id}` - Update a task
- `DELETE /api/v1/tasks/{task_id}` - Delete a task

### Chat
- `WebSocket /api/v1/chat` - AI chat endpoint

### Utility
- `GET /health` - Health check
- `GET /` - API information
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

## Setup Instructions

### 1. Environment Setup

1. Copy the environment template:
   ```bash
   cp env_template.txt .env
   ```

2. Edit `.env` file with your actual values:
   ```env
   DATABASE_URL=postgresql+psycopg2://username:password@host:port/database_name
   GOOGLE_API_KEY=your_google_api_key_here
   DEBUG=True
   ENVIRONMENT=development
   ```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Database Setup

Make sure your PostgreSQL database is running and accessible. The application will automatically create the required tables on startup.

### 4. Run the Application

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 5. Access the Application

- **API Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Project Structure

```
backend/
├── app/
│   ├── __pycache__/
│   ├── agent.py          # AI agent implementation
│   ├── crud.py           # Database CRUD operations
│   ├── database.py       # Database configuration
│   ├── main.py           # FastAPI application entry point
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   └── routes/
│       ├── __pycache__/
│       ├── chat.py       # WebSocket chat routes
│       └── tasks.py      # Task management routes
├── requirements.txt      # Python dependencies
├── env_template.txt     # Environment variables template
└── README.md           # This file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GOOGLE_API_KEY` | Google Generative AI API key | Yes |
| `DEBUG` | Enable debug mode | No |
| `ENVIRONMENT` | Application environment | No |

## Security Notes

- ✅ Database credentials are stored in environment variables
- ✅ API keys are stored in environment variables
- ✅ No hardcoded secrets in the codebase
- ✅ CORS is configured for frontend integration

## Error Handling

The application includes comprehensive error handling:

- **Global Exception Handler**: Catches unhandled errors
- **Database Error Handling**: Graceful database connection failures
- **API Error Responses**: Proper HTTP status codes and error messages
- **WebSocket Error Handling**: Connection and message processing errors
- **Logging**: Structured logging for debugging and monitoring

## Development Guidelines

- Follow the user rules for clean, optimized code
- Add comments for complex logic
- Use reusable components where possible
- Implement proper error boundaries
- Use environment variables for configuration
- Avoid inline queries and hardcoded values

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `DATABASE_URL` in `.env` file
   - Ensure PostgreSQL is running
   - Check network connectivity

2. **Google API Key Error**
   - Verify `GOOGLE_API_KEY` in `.env` file
   - Ensure API key has proper permissions
   - Check API quota limits

3. **Import Errors**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Check Python version compatibility

4. **CORS Issues**
   - Verify frontend origin in CORS configuration
   - Check if frontend is running on expected port

### Logs

Check the console output for detailed error messages and logs. The application logs important events and errors for debugging.

## Contributing

1. Follow the established code structure
2. Add proper error handling
3. Include comments for complex logic
4. Test all endpoints before submitting
5. Update documentation as needed


