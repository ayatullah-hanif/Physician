## 🩺 PHYSICIAN
A Deterministic Kinematic Safety Layer

Forcing Intelligent Machines to Respect Physics Before Acting

PHYSICIAN is a verification-first safety kernel for Physical AI systems.
Built for the Google Gemini 3 Global Hackathon, it bridges the critical gap between probabilistic AI reasoning and deterministic Newtonian physics.

As AI systems move from screens into the physical world, reasoning alone is no longer enough. PHYSICIAN ensures that intelligent machines do not just decide — they verify.

## 🚀 The Problem: The Kinematic Gap

Modern Vision-Language-Action (VLA) models can generate impressively logical plans, yet they remain physically illiterate.

A system may confidently decide to:

Lift a box without knowing its mass

Turn sharply on a low-friction surface
Apply forces that exceed structural limits

In software, hallucinations cause bugs.
In robotics, hallucinations cause multi-thousand-dollar hardware failures and human risk.

PHYSICIAN acts as a Kinematic Conscience — it does not ask “Does this make sense?”
It asks “Is this physically possible?”

## ⚙️ The Solution: A Physical OS Kernel

PHYSICIAN treats the laws of physics as system constraints, similar to how an operating system manages CPU and memory.

Every action is intercepted before it reaches physical motors and validated inside a deterministic simulation.

## Core Concepts

**System Calls**
Natural language commands like “Lift the box” are treated as requests to manipulate physical resources.

**Kernel Verification**
Each command is pre-executed inside a digital twin of the environment.

**Interrupt Handling**
If the simulation predicts a crash (slip, tip-over, breakage), PHYSICIAN issues a Kinematic Interrupt and blocks execution.

## 🛠️ How It Works: The 3-Layer Pipeline
1️⃣ Perception Layer — Mechanical Intuition

Powered by Gemini 3 Flash, PHYSICIAN performs multimodal reasoning on visual input to infer hidden physical properties:

Friction Estimation
Inferred from surface texture, reflectivity, and material cues.

Mass Inversion
Estimated from object geometry and visual context (e.g., cardboard vs steel).

Intent Decoding
Converts natural language commands into raw force vectors and motion intent.

2️⃣ Verification Layer — The Truth Engine

All inferred parameters are injected into a headless PyBullet physics simulator, creating a deterministic digital twin.

The system simulates the requested action over a defined prediction horizon and evaluates stability:

∑ F_ext · r < Torque_limit


This layer determines whether the action violates physical constraints such as:

Center of gravity limits

Friction thresholds

Torque and force bounds

3️⃣ Governance Layer — The Safety Gate

The Logic Governor evaluates the simulation outcome.

If physics constraints are satisfied → GO

If a violation is detected (e.g., tipping angle > 45°) → BLOCKED

Every decision is auditable, deterministic, and explainable.

## 🏗️ Technical Architecture
Layer	Technology	Function
Brain	Gemini 3 Flash	Vision-Language-Action reasoning & material inference
Physics Kernel	PyBullet	Deterministic kinematic simulation
Middleware	FastAPI	Real-time orchestration & validation pipeline
Interface	React	Forensic dashboard & stability visualization
## 📥 Installation & Setup
Prerequisites

Python 3.10+

Node.js & npm

Google Gemini API Key

## Backend Setup
cd backend
python -m venv venv
# Windows
venv\Scripts\activate

pip install -r requirements.txt

# Add your key to .env
GEMINI_API_KEY=your_key_here

python main.py

Frontend Setup
cd frontend
npm install
npm run dev

## 🚦 Roadmap

 Real-time VLA Sync
Move from single-image validation to continuous 30fps video verification.

 Hardware Drivers
Plug-and-play support for real robotic platforms (UR5, Tesla Bot).

 Black Box Forensics
Automatic post-incident “Medical Reports” explaining precise torque, friction, or stability failures.

## 🧠 Philosophy

For decades, operating systems managed digital resources.
PHYSICIAN extends that idea to the physical world.

It is a Physical OS Layer — one that enforces reality itself as a system constraint.

In the era of Physical AI, intelligence without physics is dangerous.
PHYSICIAN ensures machines don’t just act — they respect.