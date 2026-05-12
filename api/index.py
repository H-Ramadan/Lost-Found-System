import os
import sys

# Add the backend directory to the sys.path so we can import from it
path = os.path.join(os.path.dirname(__file__), '..', 'lostfound_backend')
sys.path.append(path)

from app import app

# Vercel needs the app object
app = app
