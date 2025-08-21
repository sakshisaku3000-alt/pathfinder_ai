# PathFinder AI - Career Decision Assistant

An AI-powered web application that helps Masters students make informed decisions between pursuing a PhD or entering industry careers.

## 🌐 Live Application

**Live Demo:** https://pathfinder-ai-19.onrender.com/
**API Documentation:** https://pathfinder-ai-17.onrender.com/docs

## Features

* **AI-Powered Analysis**: It uses Hugging Face's language models to provide personalized career recommendations
* **Comprehensive Assessment**: This application has a 6-step questionnaire covering academic background, experience, motivations, and preferences
* **RESTful API**: Built with FastAPI for robust backend services
* **Modern UI**: React-based frontend with intuitive user experience
* **Editable Results**: Users can modify AI-generated insights
* **No Authentication Required**: Instant access without login
* **Production Deployment**: Fully deployed on Render with separate frontend and backend services

## Technology Stack

* **Backend**: Python 3.8+, FastAPI, Pydantic
* **Frontend**: React 18, JavaScript, CSS3
* **AI Integration**: Hugging Face Transformers API
* **Deployment**: Render (Production)
* **Testing**: Python unittest, Manual testing

## Prerequisites

* Python 3.8 or higher
* Node.js 14+ and npm
* Hugging Face API key (free tier available)

## Installation (Local Development)

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

### `cd backend/frontend`


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

### `cd backend/frontend`
### `npm start`

The application will open at `http://localhost:3000`

## Running Tests

### Backend Tests

### `cd backend`
### `python test_main.py`

### Frontend Tests

### `cd backend/frontend`
### `npm test`

## API Endpoints

* `GET /` - API information
* `GET /health` - Health check endpoint
* `POST /api/v1/analyze` - Analyze career profile and get recommendations
* `GET /api/v1/example` - Get example assessment data

## Contributing

This is a demonstration project for academic purposes.

## Author

Sakshi Singh  
Masters in Computer Science

## Note

This is a proof-of-concept application. Career decisions should involve consultation with advisors and mentors.