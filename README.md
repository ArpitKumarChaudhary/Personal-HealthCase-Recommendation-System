Personal Healthcare Recommendation System

A full-stack web application that provides personalized health recommendations based on user input like age, weight, goals, medical conditions, and activity level. The system integrates a React-based frontend with a FastAPI backend and supports intelligent advice generation.


---


Features
1) User authentication and profile creation
2) Collects health metrics (BMI, water intake, goals)
3) AI/ML-based personalized health recommendations
4) Exercise and diet plans
5) Daily water intake scheduler
6) React + Tailwind UI dashboard
7) Admin and User views (role-based)
8) ML model integration (optional, if used)


---


Tech Stack

1) Frontend : React, TypeScript, Tailwind CSS, Vite, Lucide React Icons

2) Backend : FastAPI, MySQL, Pydantic, SQLAlchemy, Uvicorn, Python-dotenv


---


Getting Started

1) Clone the Repository

''bash
git clone https://github.com/ArpitKumarChaudhary/Personal-HealthCase-Recommendation-System.git
cd Personal-HealthCase-Recommendation-System


2) Frontend Setup

npm install
npm run dev


3️) Backend Setup

cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
