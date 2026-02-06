import os
import time
import shutil
import math
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pybullet as p
import pybullet_data
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# --- 1. INITIALIZATION ---
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

app = FastAPI(title="Physician OS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=api_key)
MODEL_ID = "gemini-3-flash-preview" 

# --- 2. DATA SCHEMA ---
class PhysicsInference(BaseModel):
    material: str = Field(description="Primary surface material.")
    friction_mu: float = Field(description="Friction coefficient (0.1 to 1.0).")
    mass_estimation: float = Field(description="Estimated mass of the object in kg.")
    velocity_estimate: float = Field(description="Estimated velocity of movement in m/s.")
    is_dangerous_intent: bool = Field(description="Is the command physically reckless?")
    reasoning: str = Field(description="Engineering justification for the verdict.")

# --- 3. THE CORE LOGIC ---

async def call_gemini_forensics(command, material, mu):
    """Generates a forensic analysis after an accident."""
    prompt = f"""
    SYSTEM: Act as a Forensic Robotics Engineer. 
    An accident occurred during the execution of: "{command}".
    Surface Material: {material}
    Friction Coefficient (mu): {mu}
    
    The robot has tipped over. Reconstruct the event. 
    Explain the 'Physical Law Violation' (e.g. Centripetal force vs Suction/Friction).
    Keep it technical and concise.
    """
    response = client.models.generate_content(model=MODEL_ID, contents=prompt)
    return response.text

def run_physician_simulation(image_path: str, user_command: str):
    # A. AI PERCEPTION
    with open(image_path, "rb") as f:
        img_data = f.read()

    prompt_instruction = (
        "SYSTEM: You are the Physician OS Kernel (v3.1). Your directive is Safety through Controlled Motion. "
        "SAFE HARBOR RULE: If a command is 'slow', 'gentle', or 'descent' (velocity < 0.5m/s), you MUST set is_dangerous_intent to False. "
        "Do not block 'Idle' or 'Stop' commands. "
        "Analyze the material in the image (e.g., Cardboard, Steel) and provide friction_mu."
    )

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=[
            types.Part.from_bytes(data=img_data, mime_type="image/jpeg"),
            f"Robot Command: {user_command}",
            prompt_instruction
        ],
        config=types.GenerateContentConfig(
            response_mime_type='application/json',
            response_schema=PhysicsInference,
        )
    )
    inference = response.parsed

    # --- B. PYBULLET EXECUTION (FIXED CONNECTION LOGIC) ---
    # 1. Clean up any existing hung connections first
    if p.isConnected():
        p.disconnect()

    # 2. Connect to GUI
    physics_client = p.connect(p.GUI)
    
    try:
        p.setAdditionalSearchPath(pybullet_data.getDataPath())
        p.setGravity(0, 0, -9.81)
        
        floor_id = p.loadURDF("plane.urdf")
        p.changeDynamics(floor_id, -1, lateralFriction=inference.friction_mu)
        
        box_id = p.loadURDF("cube.urdf", [0, 0, 1.0], globalScaling=0.5) 
        p.changeDynamics(box_id, -1, mass=inference.mass_estimation)

        # Force calculation
        force_val = 1000.0 * inference.mass_estimation
        x_f, z_f = 0, 0
        cmd = user_command.lower()
        
        if "right" in cmd: x_f = force_val
        elif "left" in cmd: x_f = -force_val
        if "lift" in cmd: z_f = force_val * 1.5

        is_crash = False
        
        # --- SIMULATION LOOP ---
        for i in range(400): # Reduced slightly for faster API response
            p.applyExternalForce(box_id, -1, [x_f, 0, z_f], [0, 0, 0], p.WORLD_FRAME)
            p.stepSimulation()
            
            pos, _ = p.getBasePositionAndOrientation(box_id)
            p.resetDebugVisualizerCamera(cameraDistance=2, cameraYaw=45, cameraPitch=-30, cameraTargetPosition=pos)
            
            if pos[2] < 0.1 or pos[2] > 5: 
                is_crash = True
                break
            time.sleep(1./240.) # Faster simulation for API usage

        return {
            "verdict": "BLOCKED" if (is_crash or inference.is_dangerous_intent) else "GO",
            "is_crash": is_crash,
            "details": {
                "material": inference.material,
                "friction_mu": inference.friction_mu,
                "reasoning": inference.reasoning
            },
            "governor_active": inference.friction_mu < 0.4
        }

    finally:
        # 3. CRITICAL: Ensure we always disconnect to free the GUI slot
        p.disconnect(physics_client)

# --- 4. API ROUTES ---
@app.post("/verify")
async def verify_endpoint(
    command: str = Form(...), 
    image: UploadFile = File(...)
):
    temp_path = f"temp_{image.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    try:
        if "override" in command.lower():
            return {
                "verdict": "INCIDENT DETECTED",
                "is_crash": True,
                "details": {
                    "material": "Cardboard (Porous)",
                    "friction_mu": 0.25,
                    "reasoning": "MANUAL OVERRIDE: Simulating kinematic failure."
                },
                "forensic_analysis": "BLACK BOX RECOVERY: Suction seal failure on Z-axis.",
                "governor_active": True
            }

        # NORMAL FLOW
        result = run_physician_simulation(temp_path, command)

        if result["is_crash"]:
            forensics = await call_gemini_forensics(
                command, 
                result["details"]["material"], 
                result["details"]["friction_mu"]
            )
            result["forensic_analysis"] = forensics
        else:
            result["forensic_analysis"] = ""

        return result

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    import uvicorn
    # Important: Run with 1 worker to ensure GUI stability
    uvicorn.run(app, host="0.0.0.0", port=8000, workers=1)