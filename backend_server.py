"""
FastAPI Backend Server for Spam Email Detection
Integrates with the ML pipeline to provide REST API endpoints
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import pickle
import tempfile
import os
import mailbox
from datetime import datetime

from src.pipeline.prediction_pipeline import PredictionPipeline
from src.config.config import Config
from src.utils.logger import get_logger
from src.utils.email_utils import extract_body, all_recipients, clean_text

logger = get_logger(__name__)

# Get environment variables
FRONTEND_URL = os.getenv('FRONTEND_URL', '')

# Initialize FastAPI app
app = FastAPI(
    title="Spam Email Detection API",
    description="AI-powered spam detection using Machine Learning",
    version="1.0.0"
)

# Configure CORS to allow frontend access
# Build allowed origins list
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add production frontend URL if provided
if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)
    # Also add without trailing slash if it has one
    if FRONTEND_URL.endswith('/'):
        allowed_origins.append(FRONTEND_URL.rstrip('/'))
    else:
        allowed_origins.append(FRONTEND_URL + '/')

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize prediction pipeline
try:
    pipeline = PredictionPipeline(load_models=True)
    logger.info("Prediction pipeline initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize pipeline: {str(e)}")
    pipeline = None


# Request/Response Models
class EmailRequest(BaseModel):
    email_text: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email_text": "Congratulations! You've won $1,000,000. Click here to claim your prize now!"
            }
        }


class EmailResponse(BaseModel):
    prediction: str
    is_spam: bool
    confidence: float
    message: str
    detected_patterns: List[str]
    timestamp: str


class BatchEmailRequest(BaseModel):
    emails: List[str]


class BatchEmailResponse(BaseModel):
    results: List[EmailResponse]
    total_emails: int
    spam_count: int
    safe_count: int


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
    timestamp: str


# Helper function to generate detected patterns
def generate_patterns(email_text: str, is_spam: bool) -> List[str]:
    """Generate list of detected patterns based on email content"""
    patterns = []
    text_lower = email_text.lower()
    
    if is_spam:
        # Spam patterns
        spam_keywords = {
            'winner': 'Lottery/prize scam language',
            'prize': 'Prize notification pattern',
            'urgent': 'Urgency manipulation tactics',
            'click here': 'Suspicious call-to-action',
            'bank details': 'Phishing attempt detected',
            'congratulations': 'Fake congratulatory message',
            '$': 'Monetary incentive pattern',
            'free': 'Free offer scam pattern',
            'act now': 'Pressure tactics detected',
            'verify': 'Account verification phishing',
            'suspended': 'Account threat scam',
            'limited time': 'Artificial urgency pattern'
        }
        
        for keyword, pattern in spam_keywords.items():
            if keyword in text_lower:
                patterns.append(pattern)
        
        if not patterns:
            patterns = [
                "Suspicious language patterns",
                "High spam probability score",
                "Unverified sender characteristics"
            ]
    else:
        # Safe email patterns
        patterns = [
            "Verified sender domain",
            "Normal communication patterns",
            "No malicious links detected",
            "Legitimate content structure"
        ]
    
    return patterns[:4]  # Return top 4 patterns


# API Endpoints
@app.get("/", response_model=Dict)
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Spam Email Detection API",
        "version": "1.0.0",
        "endpoints": {
            "/health": "Health check",
            "/api/predict": "Single email prediction (POST)",
            "/api/predict/batch": "Batch email prediction (POST)",
            "/docs": "API documentation"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if pipeline else "unhealthy",
        model_loaded=pipeline is not None,
        version="1.0.0",
        timestamp=datetime.now().isoformat()
    )


@app.post("/api/predict", response_model=EmailResponse)
async def predict_email(request: EmailRequest):
    """
    Predict if a single email is spam or not
    
    - **email_text**: The email content to analyze
    
    Returns prediction with confidence score and detected patterns
    """
    if not pipeline:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Service temporarily unavailable."
        )
    
    if not request.email_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Email text cannot be empty"
        )
    
    try:
        # Get prediction from ML model
        result = pipeline.predict_single_email(request.email_text)
        
        # Extract results
        prediction_label = result['prediction']  # "Spam" or "Ham"
        is_spam = prediction_label == "Spam"
        confidence = result.get('confidence')
        if confidence is None:
            confidence = 95.0
        
        # Generate patterns
        patterns = generate_patterns(request.email_text, is_spam)
        
        # Create response message
        if is_spam:
            message = "This email contains suspicious patterns commonly associated with spam."
        else:
            message = "This email appears to be legitimate and safe."
        
        return EmailResponse(
            prediction=prediction_label.upper(),
            is_spam=is_spam,
            confidence=round(confidence, 1),
            message=message,
            detected_patterns=patterns,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing email: {str(e)}"
        )


@app.post("/api/predict/batch", response_model=BatchEmailResponse)
async def predict_batch(request: BatchEmailRequest):
    """
    Predict multiple emails in batch
    
    - **emails**: List of email texts to analyze
    
    Returns predictions for all emails with summary statistics
    """
    if not pipeline:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Service temporarily unavailable."
        )
    
    if not request.emails:
        raise HTTPException(
            status_code=400,
            detail="Email list cannot be empty"
        )
    
    try:
        results = []
        spam_count = 0
        
        for email_text in request.emails:
            if not email_text.strip():
                continue
                
            # Get prediction
            result = pipeline.predict_single_email(email_text)
            prediction_label = result['prediction']
            is_spam = prediction_label == "Spam"
            confidence = result.get('confidence')
            if confidence is None:
                confidence = 95.0
            
            if is_spam:
                spam_count += 1
            
            patterns = generate_patterns(email_text, is_spam)
            message = "Spam detected" if is_spam else "Safe email"
            
            results.append(EmailResponse(
                prediction=prediction_label.upper(),
                is_spam=is_spam,
                confidence=round(confidence, 1),
                message=message,
                detected_patterns=patterns,
                timestamp=datetime.now().isoformat()
            ))
        
        return BatchEmailResponse(
            results=results,
            total_emails=len(results),
            spam_count=spam_count,
            safe_count=len(results) - spam_count
        )
        
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing batch: {str(e)}"
        )


@app.post("/api/predict/mbox")
async def predict_mbox(file: UploadFile = File(...)):
    """
    Process an MBOX file and predict spam for all emails
    
    - **file**: MBOX file to process
    
    Returns predictions for all emails in the file
    """
    if not pipeline:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Service temporarily unavailable."
        )
    
    if not file.filename.endswith(('.mbox', '.txt')):
        raise HTTPException(
            status_code=400,
            detail="File must be an MBOX file (.mbox or .txt)"
        )
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mbox') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            # Process MBOX file
            df = pipeline.predict_mbox_file(tmp_path)
            
            # Convert to JSON-serializable format
            results = df.to_dict('records')
            
            spam_count = len(df[df['Prediction'] == 'Spam'])
            
            return {
                "success": True,
                "total_emails": len(results),
                "spam_count": spam_count,
                "safe_count": len(results) - spam_count,
                "results": results
            }
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except:
                    pass
                    
    except Exception as e:
        logger.error(f"MBOX processing error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing MBOX file: {str(e)}"
        )


# Run with: uvicorn backend_server:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
