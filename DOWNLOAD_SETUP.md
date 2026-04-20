# Download and Setup Instructions

## How to Download and Run on Another PC

### Step 1: Download the Project

**Option A: Download as ZIP**
1. Go to: https://github.com/VedantSawaleshwarkar/financial-rag
2. Click the green "Code" button
3. Select "Download ZIP"
4. Save the ZIP file to your desired location
5. Extract the ZIP file to a folder

**Option B: Clone with Git**
```bash
git clone https://github.com/VedantSawaleshwarkar/financial-rag.git
cd financial-rag
```

### Step 2: Prerequisites

Before running the application, ensure you have:

1. **Python 3.8 or higher**
   - Download from: https://python.org
   - During installation, check "Add Python to PATH"

2. **Node.js 16 or higher**
   - Download from: https://nodejs.org
   - Includes npm (Node Package Manager)

3. **Groq API Key** (for AI responses)
   - Sign up at: https://console.groq.com/
   - Get your free API key
   - Copy the key for Step 4

### Step 3: Automatic Setup (Recommended)

The project includes an automated setup script:

**Windows:**
```bash
setup.bat
```

This script will:
- Check Python and Node.js installation
- Create Python virtual environment
- Install all backend dependencies
- Install all frontend dependencies
- Create environment file template

### Step 4: Configure API Key

After running setup.bat:

1. Open the `backend\.env` file (created by setup script)
2. Replace the placeholder with your actual Groq API key:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```
3. Save the file

### Step 5: Start the Application

**Option A: Start Both Servers (Recommended)**
```bash
start-all.bat
```

**Option B: Start Servers Separately**
```bash
# Backend (in one terminal)
start-backend.bat

# Frontend (in another terminal)
start-frontend.bat
```

### Step 6: Access the Application

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000

The application will open automatically in your browser when using start-all.bat.

## Manual Setup (If setup.bat fails)

### Backend Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Go back to root directory
cd ..
```

### Environment Configuration
Create a file named `backend\.env` with:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Troubleshooting

### Common Issues and Solutions

1. **Python not found**
   - Install Python 3.8+ from python.org
   - Make sure to check "Add Python to PATH"

2. **Node.js not found**
   - Install Node.js 16+ from nodejs.org
   - Restart command prompt after installation

3. **Port already in use**
   - Make sure ports 3000 and 8000 are available
   - Close other applications using these ports

4. **Module not found errors**
   - Run `setup.bat` again
   - Or manually install with `pip install -r requirements.txt`

5. **"Service temporarily unavailable" error**
   - Check that your Groq API key is valid
   - Ensure the API key is correctly added to `backend\.env`

6. **Frontend compilation errors**
   - Run `npm install` in frontend directory
   - Delete `node_modules` and run `npm install` again

7. **Backend fails to start**
   - Check Python virtual environment is activated
   - Verify all dependencies are installed

### Getting Help

If you encounter issues:

1. Check the console output for specific error messages
2. Verify all prerequisites are installed
3. Ensure the API key is correctly configured
4. Try running the setup script again

## Project Structure

```
financial-rag/
|
|-- backend/                 # Python FastAPI backend
|   |-- main.py             # Main FastAPI application
|   |-- rag_engine.py       # RAG AI engine
|   |-- market_data.py      # Market data fetching
|   |-- .env                # Environment variables (create this)
|   |-- requirements.txt    # Python dependencies
|
|-- frontend/               # React frontend
|   |-- src/                # React components
|   |-- package.json        # Node.js dependencies
|   |-- public/             # Static files
|
|-- setup.bat              # Automated setup script
|-- start-all.bat          # Start both servers
|-- start-backend.bat       # Start backend only
|-- start-frontend.bat      # Start frontend only
|-- README.md              # Project documentation
|-- requirements.txt       # Backend dependencies
```

## Features Available

- **Real-time Market Data**: NIFTY50, SENSEX, Gold, Crude Oil, USD/INR, Silver
- **AI Financial Advisor**: Powered by Groq LLaMA 3 with RAG
- **Interactive Charts**: Historical price data and trends
- **Portfolio Tracking**: P&L calculations and portfolio management
- **Economic Indicators**: Key financial metrics and indicators

Enjoy using the Financial RAG Application!
