import os
import shutil
import uuid
from dotenv import load_dotenv 
load_dotenv()
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bridge import run_physician_simulation

# Initialize the FastAPI App
app = FastAPI(
    title="PHYSICIAN Kinematic API",
    description="The bridge between Gemini 3 reasoning and PyBullet physics validation."
)

# --- 1. CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# Create a temporary directory for uploaded telemetry images
UPLOAD_DIR = "temp_telemetry"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def health_check():
    """Simple endpoint to verify the backend is live."""
    return {"status": "online", "system": "PHYSICIAN Kinematic Layer"}

@app.post("/verify")
async def verify_intent(
    command: str = Form(...), 
    image: UploadFile = File(...)
):
    """
    The main verification endpoint.
    Receives: A text command and an image file.
    Returns: A JSON object with AI inference and Physics verdict.
    """
    # 1. Generate a unique filename to avoid collisions
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    temp_file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # 2. Save the uploaded telemetry image to the temp folder
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # 3. CALL THE BRIDGE
        result = run_physician_simulation(temp_file_path, command)

        # 4. Return the comprehensive result to the UI
        return {
            "status": "success",
            "verdict": result["verdict"],  # "GO" or "BLOCKED"
            "telemetry": {
                "material": result["material"],
                "friction_mu": result["mu"],
                "is_stable": result["is_stable"],
            },
            "reasoning": result.get("reasoning", "Physics validation complete.")
        }

    except Exception as e:
        # Catch errors and return a clean message to the UI
        raise HTTPException(status_code=500, detail=f"Verification Engine Error: {str(e)}")

    finally:
        # 5. CLEANUP: Delete the temp image after processing to save space
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    print("🚀 PHYSICIAN Backend starting on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)