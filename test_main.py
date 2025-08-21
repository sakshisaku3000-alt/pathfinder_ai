from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_api_is_running():
    """Test if API is running"""
    response = client.get("/")
    assert response.status_code == 200
    print("✓ API is running")

def test_health_check():
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("✓ Health check passed")

def test_analyze_works():
    """Test if analyze endpoint works with valid data"""
    test_data = {
        "academic": {
            "field_of_study": "Computer Science",
            "specialization": "Machine Learning",
            "gpa_range": "1.4-1.7",
            "research_papers": 2,
            "thesis_status": "in-progress"
        },
        "experience": {
            "internship_months": 6,
            "work_experience_years": 0,
            "research_experience": "lab",
            "teaching_experience": "TA",
            "most_enjoyed": "research"
        },
        "motivations": {
            "phd_reasons": ["passionate-research"],
            "industry_reasons": ["financial"]
        },
        "work_style": {
            "work_environment": "independent",
            "project_preference": "deep",
            "future_vision": "scientist",
            "priorities": ["intellectual", "financial"]
        },
        "reality_check": {
            "long_problems": 4,
            "quick_results": 2,
            "uncertainty": 4,
            "structured": 2,
            "writing_presenting": 5
        }
    }
    
    response = client.post("/api/v1/analyze", json=test_data)
    assert response.status_code == 200
    
    result = response.json()
    assert "ai_recommendation" in result
    assert "confidence_level" in result
    print("✓ Analysis endpoint works")

if __name__ == "__main__":
    print("Running PathFinder AI Tests...\n")
    test_api_is_running()
    test_health_check()
    test_analyze_works()
    print("\n✅ All tests passed!")