# PathFinder AI - Career Decision Assistant

An AI-powered web application that helps Master's students make informed decisions between pursuing a PhD or entering industry careers.

## Features

* **AI-Powered Analysis**: It uses Hugging Face's language models to provide personalized career recommendations
* **Comprehensive Assessment**: This application has a 6-step questionnaire covering academic background, experience, motivations, and preferences
* **RESTful API**: Built with FastAPI for robust backend services
* **Modern UI**: React-based frontend with intuitive user experience
* **Editable Results**: Users can modify AI-generated insights
* **No Authentication Required**: Instant access without login

## Technology Stack

* **Backend**: Python 3.8+, FastAPI, Pydantic
* **Frontend**: React 18, JavaScript, CSS3
* **AI Integration**: Hugging Face Transformers API
* **Testing**: Python unittest, Manual testing

## Prerequisites

* Python 3.8 or higher
* Node.js 14+ and npm
* Hugging Face API key (free tier available)

## Installation

### Backend Setup

1. Navigate to the backend directory:

### `cd backend`

2. Create a virtual environment:

### `python -m venv venv`
### `source venv/bin/activate`  
### On Windows: `venv\Scripts\activate`

3. Install dependencies:

### `pip install -r requirements.txt`


4. Set your Hugging Face API key:

### `export HF_API_KEY="your_hugging_face_api_key"`  
### On Windows: `set HF_API_KEY=your_key`


### Frontend Setup

1. Navigate to the frontend directory:

### `cd frontend`


2. Install dependencies:

### `npm install`

## Running the Application

### Start the Backend Server

### `cd backend`
### `python main.py`
### Or use: `uvicorn main:app --reload`


The API will be available at `http://localhost:8000`  
API documentation: `http://localhost:8000/docs`

### Start the Frontend Application

In a new terminal:

### `cd frontend`
### `npm start`

The application will open at `http://localhost:3000`

## Running Tests

### Backend Tests

### `cd backend`
### `python test_main.py`

### Frontend Tests

### `cd frontend`
### `npm test`

## API Endpoints

* `GET /` - API information
* `GET /health` - Health check endpoint
* `POST /api/v1/analyze` - Analyze career profile and get recommendations
* `GET /api/v1/example` - Get example assessment data

## How It Works

1. Users complete a comprehensive assessment covering:
   * Academic background (GPA, research papers, thesis status)
   * Experience profile (internships, research, teaching)
   * Career motivations
   * Working style preferences
   * Future vision and priorities

2. The FastAPI backend processes the data:
   * Validates input using Pydantic models
   * Creates contextual prompt for AI
   * Calls Hugging Face API for analysis
   * Parses and structures the response

3. Results include:
   * Primary recommendation (PhD/Industry/Both)
   * Detailed editable analysis

## Contributing

This is a demonstration project for academic purposes.

## License

MIT License

## Author

Sakshi Singh  
Masters in Computer Science

## Note

This is a proof-of-concept application. Career decisions should involve consultation with advisors and mentors.