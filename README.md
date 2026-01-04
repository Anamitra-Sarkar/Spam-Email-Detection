# Spam Email Classification System

A production-grade machine learning system designed to robustly classify emails as "Spam" or "Ham" (legitimate). This project features a modular pipeline architecture for training and inference, integrated with both a modern React frontend and FastAPI backend for a complete full-stack experience.

## 🚀 Key Features

- **Full-Stack Application**: React frontend + FastAPI backend with ML integration
- **Advanced ML Pipeline**: Modular design separating data ingestion, transformation, and model training.
- **Multiple Model Support**: evaluation of various algorithms including SVM, Logistic Regression, Decision Trees, and Random Forest.
- **Interactive Web UI**: Built with React and Tailwind CSS for beautiful, real-time spam analysis.
- **REST API**: FastAPI-powered endpoints for programmatic access.
- **Alternative Streamlit UI**: Included for quick demonstrations and MBOX file processing.
- **MBOX Support**: Native capability to process and classify entire `mbox` email archives.
- **Detailed Analytics**: Comprehensive logging and performance metrics (Precision, Recall, F1-Score).
- **97.9% Accuracy**: Industry-leading spam detection with trained SVM model.

## 🛠️ Tech Stack

- **Language**: Python 3.10+
- **Backend**: FastAPI 0.115.6
- **Frontend**: React 19.0, Tailwind CSS, Framer Motion
- **Alternative UI**: Streamlit
- **ML Framework**: Scikit-learn 1.6.1
- **Data Processing**: Pandas, NumPy, BeautifulSoup4
- **Project Management**: `uv` (recommended) or `pip`

## 📂 Project Structure

```
├── backend_server.py       # FastAPI Backend Server (NEW)
├── app.py                  # Streamlit Web Application (Alternative)
├── requirements.txt        # Python dependencies
├── INTEGRATION_GUIDE.md    # Complete integration documentation (NEW)
├── start.bat / start.sh    # Quick start scripts (NEW)
├── src/
│   ├── components/         # Core processing modules (Ingestion, Transformation)
│   ├── pipeline/           # Orchestration pipelines (Training, Prediction)
│   ├── config/             # Configuration and parameters
│   └── utils/              # Helper functions, logging, and state management
├── frontend/               # React Frontend Application (NEW)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── App.js         # Main application
│   └── package.json
├── data/                   # Dataset storage (inputs)
├── outputs/                # Training artifacts (models, vectorizers)
└── logs/                   # System runtime logs
```

## ⚡ Installation

### Quick Start (Recommended)

**Windows:**
```bash
# Run the automated startup script
start.bat
```

**Linux/Mac:**
```bash
# Make script executable and run
chmod +x start.sh
./start.sh
```

This will automatically:
1. Install Python dependencies
2. Install frontend dependencies
3. Start the FastAPI backend (port 8000)
4. Start the React frontend (port 3000)
5. Open the application in your browser

### Manual Installation

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd Spam-Email-Detection
   ```

2. **Set up Python Environment**
   It is recommended to use a virtual environment.
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## 🖥️ Usage

### Option 1: Full Stack Application (React + FastAPI)

**Start Backend Server:**
```bash
# From project root
python backend_server.py

# Or with uvicorn
uvicorn backend_server:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API Documentation: http://localhost:8000/docs

**Start Frontend:**
```bash
# From frontend directory
cd frontend
npm start
```

Frontend runs at: http://localhost:3000

**Features:**
- Real-time spam detection with beautiful UI
- Confidence scores and pattern analysis
- Sample data for testing
- Live API connection status
- Automatic fallback to offline mode

### Option 2: Streamlit Application (Alternative)

Launch the interactive Streamlit dashboard:

```bash
streamlit run app.py
```

- **Single Email Tab**: Paste email content to get an immediate Spam/Ham prediction with a confidence score.
- **Batch Processing Tab**: Upload an `.mbox` file to process multiple emails at once and download the results as a CSV.

### Option 3: API Access

Use the REST API programmatically:

```python
import requests

# Predict single email
response = requests.post('http://localhost:8000/api/predict', 
    json={'email_text': 'Your email content here...'})
result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']}%")
```

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for complete API documentation.

### 2. Training the Model
(Optional) If you wish to retrain the models on new data:

1. Place your dataset in `data/dataset/dataset.csv`.
2. Run the training pipeline:
   ```bash
   python -m src.pipeline.training_pipeline
   ```
3. Artifacts (Model & Vectorizer) will be saved in the `outputs/` directory.
4. **Important**: Update `src/config/config.py` with the new paths to your generated model and vectorizer if they change.

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide for Vercel and Render
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete guide for running the full-stack application
- **[API Documentation](http://localhost:8000/docs)** - Interactive API documentation (when backend is running)
- **[Frontend README](frontend_vite/README.md)** - Frontend-specific documentation and setup
- **Model Training Logs** - Check `logs/` directory for detailed training information
- **Model Metrics** - View `outputs/*/observations/` for performance reports

## 🚀 Deployment

This application is designed to be deployed on:
- **Frontend**: Vercel (recommended for React/Vite apps)
- **Backend**: Render (recommended for Python FastAPI apps)

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete step-by-step deployment instructions, including:
- Setting up Vercel for frontend hosting
- Configuring Render for backend deployment
- Environment variable configuration
- Connecting frontend and backend in production
- Troubleshooting common deployment issues

## ⚙️ Configuration

The system is highly configurable via `src/config/config.py`. You can adjust:
- Model hyperparameters (Grid Search configuration)
- Input/Output paths
- Training parameters (Cross-validation folds, etc.)

## 📊 Model Performance

The pipeline automatically evaluates models using 5-fold cross-validation. Metrics including Accuracy, Precision, Recall, and F1-Score are logged for each experiment. By default, the system selects the best performing model (often SVM or Random Forest) for inference.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
