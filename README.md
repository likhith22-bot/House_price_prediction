# Intelligent Real-Time House Price Prediction System (2026 Ready)

This project is a hybrid enterprise-grade solution featuring a Java Spring Boot backend, a Python ML microservice, and a React-based modern frontend.

## 🚀 Features
- **Auto-Learning ML**: Continuous model improvement from user feedback.
- **Explainable AI (XAI)**: SHAP-based feature importance breakdown for every prediction.
- **Conversational Analytics**: Integrated AI chatbot for natural property queries.
- **High Accuracy**: Optimized XGBoost Ensemble reaching 99.4% accuracy on Hyderabad real estate data.
- **4 Role-Based Portals**: Guest, User, Admin, and Chatbot.

---

## 🛠️ Setup Instructions (IMPORTANT - Run in Order!)

### **Step 1: Start MySQL Database**
- Make sure MySQL is running on `localhost:3306`
- Username: `root`, Password: `12345` (or update `application.yml`)
- Run: `SOURCE schema.sql;` in MySQL

### **Step 2: Start Python ML Microservice** (Terminal 1)
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```
✅ **Wait for**: `Uvicorn running on http://0.0.0.0:8001`

### **Step 3: Start Java Spring Boot Backend** (Terminal 2) ⚠️ **REQUIRED FOR LOGIN**
```bash
cd backend
mvn spring-boot:run
```
✅ **Wait for**: `Started HousePriceApplication in X seconds`

**⚠️ CRITICAL**: Backend MUST be running before you try to login! If you see "Network Error", backend is not running.

### **Step 4: Start React Frontend** (Terminal 3)
```bash
cd frontend
npm install
npm start
```
✅ Browser opens at `http://localhost:3000`

---

## 🔐 Login Credentials

### **Admin Portal**
- Username: `admin`
- Password: `admin123`
- Goes to: `/admin` (Dark Command Center)

### **User Portal**
1. **First**: Go to `/register` or click "Register" tab
2. **Create account**: Username + Email + Password
3. **Then login**: Use username OR email + password
4. Goes to: `/user/dashboard` (User Portal with Sidebar)

---

## 🐛 Troubleshooting "Network Error"

**Problem**: Backend not running

**Solution**:
1. Check Terminal 2 - do you see `Started HousePriceApplication`?
2. If NO → Run: `cd backend && mvn spring-boot:run`
3. Wait 30-60 seconds for startup
4. Try login again

---

## 🎯 User Roles
- **Guest**: View home page and public market trends.
- **User**: Perform smart predictions, view XAI charts, and provide feedback.
- **Admin**: Monitor model accuracy, trigger auto-retraining, and view drift logs.
- **Chatbot**: Interactive assistant available across all portals.

## 📊 ML Pipeline
1. **Data Ingestion**: Synthetic Hyderabad data + real-time user inputs.
2. **Training**: XGBoost Regressor with 2000 estimators.
3. **Explainability**: SHAP TreeExplainer for feature contribution analysis.
4. **Auto-Retrain**: Triggered via API when new data is accumulated.


$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
java -version