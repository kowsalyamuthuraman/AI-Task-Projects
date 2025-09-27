from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DATABASE_URL = "postgresql+psycopg2://neondb_owner:npg_j8kdFvVM7rti@ep-long-firefly-addt9zcx-pooler.c-2.us-east-1.aws.neon.tech/neondb"
# Get database URL from environment variables
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")

# Create database engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    echo=False           # Set to True for SQL debugging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create declarative base
Base = declarative_base()


