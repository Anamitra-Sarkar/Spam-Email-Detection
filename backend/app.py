"""
Backend app entry point
Imports the FastAPI app from backend_server.py for deployment
"""

import sys
from pathlib import Path

# Add parent directory to path to import backend_server
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

from backend_server import app

__all__ = ['app']
