# Full Stack Spam Email Detection Application

## 🚀 Complete Integration Guide

This is a full-stack application with:
- **Backend**: FastAPI server with ML-powered spam detection
- **Frontend**: React application with beautiful UI
- **ML Model**: Trained SVM model with 97.9% accuracy

---

## 📋 Prerequisites

- Python 3.10+ (for backend)
- Node.js 14+ and npm (for frontend)
- Trained ML model files in `outputs/2025-12-25_14-02-05/models/`

---

## 🔧 Installation & Setup

### 1. Backend Setup (FastAPI)

#### Install Python Dependencies
```bash
# From project root directory
pip install -r requirements.txt
```

#### Verify Model Files
Ensure these files exist:
- `outputs/2025-12-25_14-02-05/models/SVM_model.pkl`
- `outputs/2025-12-25_14-02-05/models/vectorizer.pkl`

These paths are configured in `src/config/config.py`

---

### 2. Frontend Setup (React)

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Node Dependencies
```bash
npm install
```

---

## ▶️ Running the Application

### Step 1: Start the Backend Server

From the **project root directory**:

```bash
# Option 1: Using Python directly
python backend_server.py

# Option 2: Using uvicorn
uvicorn backend_server:app --reload --port 8000
```

The backend will start at: **http://localhost:8000**

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

#### Verify Backend is Running
Open http://localhost:8000/docs in your browser to see the interactive API documentation.

---

### Step 2: Start the Frontend Server

From the **frontend directory**:

```bash
npm start
```

The frontend will start at: **http://localhost:3000**

Your browser should automatically open the application.

---

## 🎯 Using the Application

### Web Interface Features

1. **Single Email Analysis**
   - Paste email content in the text area
   - Click "ANALYZE_EMAIL" button
   - Get instant spam/safe prediction with confidence score
   - View detected patterns

2. **Sample Data**
   - Click "LOAD_SPAM_SAMPLE" to test with spam email
   - Click "LOAD_SAFE_SAMPLE" to test with safe email

3. **Connection Status**
   - Green indicator: Backend connected (Live AI detection)
   - Amber indicator: Offline mode (uses mock data)

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8000`

#### 1. Health Check
```
GET /health
```
Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0",
  "timestamp": "2026-01-04T..."
}
```

#### 2. Predict Single Email
```
POST /api/predict
Content-Type: application/json

{
  "email_text": "Your email content here..."
}
```
Response:
```json
{
  "prediction": "SPAM" | "HAM",
  "is_spam": true | false,
  "confidence": 94.7,
  "message": "This email contains suspicious patterns...",
  "detected_patterns": [
    "Suspicious sender domain",
    "Excessive promotional keywords"
  ],
  "timestamp": "2026-01-04T..."
}
```

#### 3. Batch Prediction
```
POST /api/predict/batch
Content-Type: application/json

{
  "emails": [
    "First email content...",
    "Second email content..."
  ]
}
```

#### 4. MBOX File Processing
```
POST /api/predict/mbox
Content-Type: multipart/form-data

file: <.mbox file>
```

---

## 🧪 Testing the Integration

### Test 1: Backend Health Check
```bash
curl http://localhost:8000/health
```

### Test 2: Single Email Prediction
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Congratulations! You won $1,000,000!"}'
```

### Test 3: Frontend Connection
1. Open http://localhost:3000
2. Check the status badge (should show "API Connected")
3. Paste test email and click analyze
4. Verify results appear correctly

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Model not loaded" error
- **Solution**: Check that model files exist in the configured path
- Verify `src/config/config.py` has correct paths

**Problem**: Port 8000 already in use
- **Solution**: 
  ```bash
  # Use different port
  uvicorn backend_server:app --reload --port 8001
  
  # Update frontend/.env
  REACT_APP_API_URL=http://localhost:8001
  ```

**Problem**: Module not found errors
- **Solution**: 
  ```bash
  pip install -r requirements.txt
  ```

---

### Frontend Issues

**Problem**: Cannot connect to backend
- **Solution**: 
  - Ensure backend is running on port 8000
  - Check `frontend/.env` has correct API URL
  - Restart frontend: `npm start`

**Problem**: CORS errors in browser console
- **Solution**: Backend CORS is pre-configured. Restart backend server.

**Problem**: npm install fails
- **Solution**: 
  ```bash
  # Clear cache
  npm cache clean --force
  
  # Delete node_modules and reinstall
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## 📁 Project Structure

```
spam-email-detection/
├── backend_server.py          # FastAPI server (NEW)
├── app.py                     # Streamlit app (alternative)
├── requirements.txt           # Python dependencies
├── src/                       # ML pipeline source code
│   ├── components/           # Data processing modules
│   ├── pipeline/             # Training & prediction pipelines
│   ├── config/               # Configuration
│   └── utils/                # Helper utilities
├── data/                      # Dataset storage
│   └── dataset/
│       └── dataset.csv
├── outputs/                   # Trained models & reports
│   └── 2025-12-25_14-02-05/
│       ├── models/
│       │   ├── SVM_model.pkl
│       │   └── vectorizer.pkl
│       └── observations/
└── frontend/                  # React frontend (NEW)
    ├── package.json
    ├── .env                   # Environment variables
    ├── public/
    └── src/
        ├── App.js
        ├── services/
        │   └── api.js        # API service layer (NEW)
        └── components/
            └── SpamDetector.jsx  # Main component (UPDATED)
```

---

## 🔒 Security Notes

1. **CORS Configuration**: Currently allows localhost origins only
2. **API Keys**: No authentication required for local development
3. **Data Privacy**: Emails are processed in memory and not stored
4. **Production Deployment**: Update CORS origins and add authentication

---

## 🚀 Production Deployment

### Backend Deployment
```bash
# Use production WSGI server
gunicorn backend_server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment
```bash
cd frontend
npm run build

# Serve build folder with any static file server
# Update REACT_APP_API_URL to production backend URL
```

---

## 📊 Performance Metrics

- **Model Accuracy**: 97.9%
- **API Response Time**: <100ms (single prediction)
- **Supported Formats**: Text, MBOX files
- **Batch Processing**: Up to 1000 emails per request

---

## 🆘 Support

### Check Backend Status
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Root Info: http://localhost:8000/

### Frontend Debugging
- Open browser console (F12) to see API calls
- Check Network tab for API requests
- Look for error messages in console

---

## ✅ Quick Start Checklist

- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Model files exist in outputs directory
- [ ] Backend server running on port 8000
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Frontend running on port 3000
- [ ] Health check passes (http://localhost:8000/health)
- [ ] Frontend shows "API Connected" status
- [ ] Test prediction works successfully

---

## 🎉 Features Integrated

✅ Real-time spam detection with ML model
✅ Beautiful, responsive UI with animations
✅ RESTful API with FastAPI
✅ Automatic fallback to offline mode
✅ Connection status indicator
✅ Error handling and user feedback
✅ Sample data for testing
✅ Interactive API documentation
✅ CORS enabled for cross-origin requests
✅ Batch processing support
✅ MBOX file processing

---

**Enjoy your fully integrated spam detection application! 🎊**
