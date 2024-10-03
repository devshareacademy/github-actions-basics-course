import uvicorn
import socket

from app import app

def main():
    port = 8080
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=port,
        reload=True
    )

if __name__ == "__main__":
    main()