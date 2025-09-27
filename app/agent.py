import os
import time
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import google.generativeai as genai
from . import crud, schemas

# -----------------------
# Task helpers
# -----------------------
def create_task_tool(title: str, description: str = "", due_date: str = None, priority: str = "normal", db: Session = None):
    task = schemas.TaskCreate(title=title, description=description, priority=priority)
    return crud.create_task(db, task)

def list_tasks_tool(db: Session = None):
    return crud.get_tasks(db)

def update_task_tool(task_id: int, status: str, db: Session = None):
    return crud.update_task(db, task_id, schemas.TaskUpdate(status=status))

def delete_task_tool(task_id: int, db: Session = None):
    return crud.delete_task(db, task_id)

# -----------------------
# Simple Agent Wrapper with Rate Limiting
# -----------------------
class SimpleAgent:
    """Lightweight wrapper around Google Generative AI with invoke interface and rate limiting."""

    def __init__(self, model_name: str | None = None):
        load_dotenv()

        # Don't hardcode API keys in production - use environment variables
        api_key = "AIzaSyBCxF_T2b0jwTF6IDXLOw1Hnw_O_x-fPcE"
        if not api_key:
            raise RuntimeError("GOOGLE_API_KEY is not set. Add it to your .env file.")

        # Try current models in order of preference for free tier
        resolved_model = (
            model_name
            or os.getenv("GEMINI_MODEL", "").strip()
            or "gemini-2.5-flash"  # Current best free tier model
        )

        genai.configure(api_key=api_key)
        self.model_name = resolved_model
        self.last_request_time = 0
        self.min_request_interval = 1.0  # Minimum 1 second between requests
        
        try:
            self.model = genai.GenerativeModel(self.model_name)
        except Exception as exc:
            raise RuntimeError(
                f"Failed to initialize model '{self.model_name}'. "
                "Check that your API key has access and model name is correct."
            ) from exc

    def _rate_limit(self):
        """Simple rate limiting to avoid hitting API limits."""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.min_request_interval:
            sleep_time = self.min_request_interval - time_since_last
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()

    def invoke(self, inputs, max_retries: int = 3, base_delay: float = 1.0):
        """Invoke the model with retry logic and exponential backoff."""
        prompt = inputs.get("input") if isinstance(inputs, dict) else str(inputs)
        
        for attempt in range(max_retries):
            try:
                self._rate_limit()
                response = self.model.generate_content(prompt)
                return response.text or ""
                
            except Exception as exc:
                error_msg = str(exc)
                
                # Handle quota exceeded errors
                if "429" in error_msg or "quota" in error_msg.lower():
                    if attempt < max_retries - 1:
                        # Extract retry delay if available
                        retry_delay = base_delay * (2 ** attempt)  # Exponential backoff
                        
                        # Try to extract suggested delay from error message
                        if "retry in" in error_msg:
                            try:
                                import re
                                match = re.search(r"retry in (\d+(?:\.\d+)?)s", error_msg)
                                if match:
                                    retry_delay = float(match.group(1))
                            except:
                                pass
                        
                        print(f"Rate limit hit, retrying in {retry_delay:.2f} seconds... (attempt {attempt + 1}/{max_retries})")
                        time.sleep(retry_delay)
                        continue
                    else:
                        return (
                            f"Quota exceeded: You've hit the free tier limits for {self.model_name}. "
                            "Consider:\n"
                            "1. Waiting for quota reset\n"
                            "2. Switching to 'gemini-2.5-flash-lite' (most cost-effective)\n"
                            "3. Upgrading to a paid plan\n"
                            "4. Using fewer/shorter requests"
                        )
                
                # Handle model access errors
                elif "was not found" in error_msg or "does not have access" in error_msg:
                    return (
                        f"Model error: Invalid or inaccessible model '{self.model_name}'. "
                        "Try switching to 'gemini-2.5-flash' or 'gemini-2.0-flash' which are currently available."
                    )
                
                # Other errors - retry with backoff
                elif attempt < max_retries - 1:
                    retry_delay = base_delay * (2 ** attempt)
                    print(f"Request failed, retrying in {retry_delay:.2f} seconds... (attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    continue
                else:
                    return f"Model error after {max_retries} attempts: {error_msg}"
        
        return "Failed to get response after all retry attempts."

# -----------------------
# Agent Factory with Model Fallback
# -----------------------
def build_agent(model_name: str | None = None):
    """Build agent with automatic fallback to current models."""
    
    # Current available models in order of preference for free tier
    fallback_models = [
        "gemini-2.5-flash-lite",  # Most cost-effective
        "gemini-2.5-flash",       # Best price-performance
        "gemini-2.0-flash-lite",  # Alternative lite model
        "gemini-2.0-flash"        # Alternative full model
    ]
    
    # If no model specified, try current models
    if not model_name:
        model_name = os.getenv("GEMINI_MODEL", fallback_models[0])
    
    try:
        return SimpleAgent(model_name)
    except RuntimeError as e:
        error_msg = str(e)
        if "was not found" in error_msg or "does not have access" in error_msg:
            # Try fallback models
            for fallback in fallback_models:
                if fallback != model_name:  # Don't retry the same model
                    try:
                        print(f"Model '{model_name}' failed, trying '{fallback}'...")
                        return SimpleAgent(fallback)
                    except RuntimeError:
                        continue
            raise RuntimeError(f"All models failed. Available models: {', '.join(fallback_models)}")
        raise

# -----------------------
# Usage Examples
# -----------------------
def example_usage():
    """Example of how to use the improved agent."""
    try:
        # Build agent (will use flash model by default for better free tier limits)
        agent = build_agent()
        
        # Test with a simple query
        response = agent.invoke("Hello, how are you?")
        print(f"Response: {response}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    example_usage()