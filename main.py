from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict
from enum import Enum
import requests
import os
from datetime import datetime

# Setting up FastAPI
app = FastAPI(
    title="PathFinder AI API",
    description="Helps students decide between PhD and Industry careers",
    version="1.0.0"
)

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
# Need CORS so React frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["frontend_url"],  # React runs on port 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face setup (using their free API)
HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"
# Get API key from environment
HUGGING_FACE_API_KEY = os.getenv("HF_API_KEY", "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")  # TODO: Set this in env!

# Enums for field validation
class FieldOfStudy(str, Enum):
    CS = "Computer Science"
    DATA_SCIENCE = "Data Science"
    AI_ML = "AI/Machine Learning"
    SOFTWARE_ENG = "Software Engineering"
    EE = "Electrical Engineering"
    ME = "Mechanical Engineering"
    BIO = "Biological Sciences"
    PHYSICS = "Physics"
    CHEMISTRY = "Chemistry"
    MATH = "Mathematics"
    OTHER = "Other"

class GPARange(str, Enum):
    EXCELLENT = "1.0-1.3"
    VERY_GOOD = "1.4-1.7"
    GOOD = "1.8-2.3"
    ABOVE_AVG = "2.4-2.7"
    AVERAGE = "2.8-3.3"
    BELOW_AVG = "3.4-4.0"

# Pydantic models for request validation
class AcademicProfile(BaseModel):
    field_of_study: FieldOfStudy
    specialization: str = Field(..., min_length=2, max_length=100)
    gpa_range: GPARange
    research_papers: int = Field(..., ge=0, le=50)
    thesis_status: str

class ExperienceProfile(BaseModel):
    internship_months: int = Field(..., ge=0, le=60)
    work_experience_years: float = Field(..., ge=0, le=20)
    research_experience: str
    teaching_experience: str
    most_enjoyed: str

class Motivations(BaseModel):
    phd_reasons: List[str] = Field(..., max_items=2)
    industry_reasons: List[str] = Field(..., max_items=2)
    
    @field_validator('phd_reasons', 'industry_reasons')
    def validate_reasons(cls, v):
        if len(v) == 0 or len(v) > 2:
            raise ValueError("Must select 1-2 reasons")
        return v

class WorkStyle(BaseModel):
    work_environment: str
    project_preference: str
    future_vision: str
    priorities: List[str] = Field(..., min_items=2, max_items=5)

# Main request model
class CareerAssessmentRequest(BaseModel):
    academic: AcademicProfile
    experience: ExperienceProfile
    motivations: Motivations
    work_style: WorkStyle

class CareerRecommendation(BaseModel):
    ai_recommendation: str
    confidence_level: str
    key_insights: List[str]
    action_items: List[str]
    timestamp: datetime

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "PathFinder AI API - Simplified Version",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "analyze": "/api/v1/analyze",
            "documentation": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "api_version": "1.0.0",
        "timestamp": datetime.now()
    }

def create_ai_prompt(assessment: CareerAssessmentRequest) -> str:
    """
    Creates a prompt for the AI model based on user's answers
    Removed reality check questions to keep it simpler
    """
    # Building a detailed prompt so AI understands the context
    prompt = f"""You are a career counselor helping a Masters student decide between PhD and Industry.

Student Profile:
- Field: {assessment.academic.field_of_study}, specializing in {assessment.academic.specialization}
- Academic Performance: {assessment.academic.gpa_range} GPA
- Research Output: {assessment.academic.research_papers} papers published
- Thesis Status: {assessment.academic.thesis_status}

Experience:
- Internship: {assessment.experience.internship_months} months
- Work Experience: {assessment.experience.work_experience_years} years
- Research Level: {assessment.experience.research_experience}
- Teaching: {assessment.experience.teaching_experience}
- Most Enjoyed: {assessment.experience.most_enjoyed}

Motivations:
- Why PhD: {', '.join(assessment.motivations.phd_reasons)}
- Why Industry: {', '.join(assessment.motivations.industry_reasons)}

Work Preferences:
- Environment: {assessment.work_style.work_environment}
- Project Style: {assessment.work_style.project_preference}
- 5-7 Year Vision: {assessment.work_style.future_vision}
- Top Priority: {assessment.work_style.priorities[0]}

Based on this profile, provide:
1. Clear recommendation (PhD, Industry, or Both are viable)
2. Brief explanation of why this path suits them
3. 3-4 specific action items they should take next

Keep the response concise and actionable."""

    return prompt

async def get_ai_analysis(prompt: str) -> Dict:
    """
    Calls Hugging Face API to get career advice
    Returns structured data from AI response
    """
    headers = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}
    
    try:
        # Making the API call
        response = requests.post(
            HUGGING_FACE_API_URL,
            headers=headers,
            json={
                "inputs": prompt,
                "parameters": {
                    "max_length": 300,  # Keeping it reasonable length
                    "temperature": 0.7  
                }
            },
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            # HF returns list sometimes, dict other times
            ai_text = result[0]['generated_text'] if isinstance(result, list) else result.get('generated_text', '')
            
            # Parse the AI response into our format
            return parse_ai_response(ai_text)
        else:
            # use backup if something went wrong
            print(f"HF API error: {response.status_code}")
            return generate_fallback_response()
            
    except Exception as e:
        # If the API fails, still give user something useful
        print(f"Error calling AI: {e}")
        return generate_fallback_response()

def parse_ai_response(ai_text: str) -> Dict:
    """
    Parse AI text into structured format
    Basic parsing - good enough for MVP
    """
    # Simple parsing
    lines = ai_text.strip().split('\n')
    
    # Extract recommendation
    recommendation = "PhD Path Recommended"  # Default
    if "industry" in ai_text.lower():
        recommendation = "Industry Path Recommended"
    elif "both" in ai_text.lower():
        recommendation = "Both Paths Are Viable"
    
    # Extract confidence
    confidence = "Moderate Confidence"
    if "strongly" in ai_text.lower() or "clearly" in ai_text.lower():
        confidence = "High Confidence"
    elif "slightly" in ai_text.lower() or "somewhat" in ai_text.lower():
        confidence = "Low Confidence"
    
    # Extract insights and action items
    insights = []
    action_items = []
    
    for line in lines:
        if line.strip():
            if any(word in line.lower() for word in ['should', 'recommend', 'suggest', 'next']):
                action_items.append(line.strip())
            elif len(insights) < 3:
                insights.append(line.strip())
    
    if not insights:
        insights = [
            "Your profile shows mixed indicators for both paths.",
            "Consider your long-term career goals carefully.",
            "Both options have merit based on your background."
        ]
    
    if not action_items:
        action_items = [
            "Research specific PhD programs or companies in your field",
            "Talk to professionals in both academia and industry",
            "Consider doing informational interviews",
            "Reflect on what type of work energizes you most"
        ]
    
    return {
        "recommendation": recommendation,
        "confidence": confidence,
        "insights": insights[:3],  # Limit to 3
        "action_items": action_items[:4]  # Limit to 4
    }

def generate_fallback_response() -> Dict:
    """
    Generate a reasonable response if AI fails
    Always better to give something than error out!
    """
    return {
        "recommendation": "Both Paths Are Viable",
        "confidence": "Moderate Confidence",
        "insights": [
            "Your profile shows potential for both PhD and industry paths.",
            "Your academic background and experience provide flexibility.",
            "The decision depends on your personal priorities and goals."
        ],
        "action_items": [
            "List pros and cons of each path based on your priorities",
            "Speak with mentors in both academia and industry",
            "Consider trying industry first - you can pursue PhD later",
            "Attend career workshops at your university"
        ]
    }

@app.post("/api/v1/analyze", response_model=CareerRecommendation)
async def analyze_career_path(assessment: CareerAssessmentRequest):
    """
    Analyze user profile using AI and provide career recommendations
    This is the main endpoint that does all the work!
    """
    try:
        # Create AI prompt from the assessment
        prompt = create_ai_prompt(assessment)
        
        # Get AI analysis
        ai_result = await get_ai_analysis(prompt)
        
        # Return structured response
        return CareerRecommendation(
            ai_recommendation=ai_result["recommendation"],
            confidence_level=ai_result["confidence"],
            key_insights=ai_result["insights"],
            action_items=ai_result["action_items"],
            timestamp=datetime.now()
        )
        
    except Exception as e:
        # Log error and return generic response
        print(f"Error in analyze: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Simple example endpoint for testing
@app.get("/api/v1/example")
async def get_example():
    """Get an example response to test if API is working"""
    return {
        "message": "API is working! Use POST /api/v1/analyze with assessment data",
        "example_field": "Computer Science",
        "example_gpa": "1.4-1.7"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)