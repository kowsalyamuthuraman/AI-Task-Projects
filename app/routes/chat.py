from fastapi import APIRouter, WebSocket, Depends
from sqlalchemy.orm import Session
from starlette.websockets import WebSocketDisconnect
from ..database import SessionLocal
from ..agent import build_agent
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
agent = None  # lazy-load agent when first needed

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.websocket("/")
async def chat_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    """WebSocket endpoint for AI chat functionality"""
    await websocket.accept()
    global agent
    
    try:
        # Initialize agent if not already done
        if agent is None:
            agent = build_agent()
            logger.info("AI agent initialized successfully")
        
        # Send welcome message
        await websocket.send_text("AI Assistant connected! How can I help you with your tasks?")
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            logger.info(f"Received message: {data[:100]}...")
            
            # Process message with AI agent
            try:
                response = agent.invoke({"input": data})
                await websocket.send_text(str(response))
            except Exception as agent_error:
                logger.error(f"Agent error: {agent_error}")
                await websocket.send_text(f"Sorry, I encountered an error: {str(agent_error)}")
                
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
        return
    except Exception as exc:
        logger.error(f"WebSocket error: {exc}")
        try:
            await websocket.send_text(f"Connection error: {str(exc)}")
        except:
            pass  # Connection might be closed

