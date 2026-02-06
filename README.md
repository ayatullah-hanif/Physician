# 🛡️ PHYSICIAN: A Deterministic Kinematic Safety Layer

**Forcing Intelligent Machines to Respect Physics Before Acting.**

Built for the **Google Gemini 3 Global Hackathon**, PHYSICIAN is a "Verification-First" safety gate designed to bridge the gap between probabilistic AI reasoning and deterministic Newtonian physics.

---

## 🚀 The Problem: The "Kinematic Gap"
AI is entering the physical world, but it remains "physically illiterate." A standard Vision-Language-Action (VLA) model might plan a high-speed turn on wet marble because it lacks an intuitive understanding of friction coefficients ($\mu$). This lead to slips, tips, and mechanical failures.

**PHYSICIAN** acts as a "Kinematic Conscience." It doesn't just ask if an action is *smart*; it asks if it is *physically possible*.

## 🛠️ How It Works (The 3-Layer Pipeline)

### 1. Perception Layer (The "Mechanical Intuition")
Using **Gemini 3 Flash**, the system analyzes visual telemetry to infer hidden physical properties:
* **Friction Estimation:** Inferred from surface texture and specular reflections.
* **Mass Inversion:** Estimated based on agent geometry and load.
* **Intent Decoding:** Translating natural language commands into force vectors.

### 2. Verification Layer (The "Truth Engine")
The system injects these parameters into a **Headless PyBullet Physics Simulator**. It creates a "Digital Twin" of the agent and simulates the command over a T+2s prediction horizon. 

### 3. Governance Layer (The "Safety Gate")
If the simulation detects a physics violation (e.g., slip distance > 0.2m or tipping angle > 30°), the **Logic Governor** inhibits the command. The final output is an auditable **GO** or **BLOCKED** verdict.

---

## 🏗️ Technical Architecture


* **Brain:** Gemini 3 Flash (Vision-Language-Action)
* **Physics Kernel:** PyBullet (Deterministic Engine)
* **Middleware:** FastAPI (Python Bridge)
* **Interface:** React (Vibe Code generated via Google AI Studio)

---


## 🚀 How to Run

**1. Backend:**
* cd backend

* pip install -r requirements.txt

* Create a .env file with your GEMINI_API_KEY.

* python main.py

**Frontend:**
* cd Frontend

* npm install

* npm run dev


---


## 🚦 Getting Started

### 1. Prerequisites
* Python 3.10+
* Node.js & npm
* Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Add your GEMINI_API_KEY to your environment variables
python main.py